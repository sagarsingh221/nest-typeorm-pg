import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AccountStatus,
  DUPLICATE_ERROR,
  Messages,
  RoleType,
  UserStatus,
} from '@src/commons/constants';
import { Repository, UpdateResult } from 'typeorm';
import {
  CreateUserDto,
  UpdateUserDto,
  UsersListSelectFields,
} from '@modules/user/dto';
import { UserEntity } from '@modules/user/entities';
import { ServerFailedException, UserNotFoundException } from '@src/exceptions';
import { UserMetaService } from '@modules/user/services';
import { AbstractService, UtilsService } from '@src/utils/services';
import { RoleEntity } from '@modules/role/entities';
import { AddUserRolesDto, RemoveUserRolesDto } from '@modules/role/dto';
// import { any } from '@modules/auth/dto';
import { RoleService } from '@modules/role/services';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class UserService extends AbstractService<UserEntity> {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(UserEntity)
    repository: Repository<UserEntity>,
    private readonly roleService: RoleService,
    @Inject(forwardRef(() => UserMetaService))
    private readonly userMetaService: UserMetaService,
  ) {
    super('user', repository, ['first_name', 'last_name', 'email', 'phone']);
  }

  async updateUser(
    uuid: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const user: UserEntity = await this.getOneByUuid(uuid, ['user.roles']);

    if (!user) {
      throw new UserNotFoundException();
    }

    const roles: RoleEntity[] = updateUserDto.roleUuids
      ? await this.roleService.getAllByUuids(updateUserDto.roleUuids)
      : [];

    user.phone = updateUserDto.phone;
    user.firstName = updateUserDto.firstName;
    user.lastName = updateUserDto.lastName;
    user.fullName = `${updateUserDto.firstName} ${updateUserDto.lastName}`;
    user.roles = roles;

    return user.save();
  }

  async create(createUserDto: CreateUserDto, creator: number): Promise<any> {
    const roles: RoleEntity[] = createUserDto.roleUuids
      ? await this.roleService.getAllByUuids(createUserDto.roleUuids)
      : [];

    const user: UserEntity = await this.createUserAndMeta(
      createUserDto,
      roles,
      creator,
      0,
    );

    return user;
  }

  /** @function createUserAndMeta
   * Creates UserMeta, assigns [Roles, Meta and Creator] to User
   * and finally saves User to db
   * @param user {CreateUserDto} User to be created
   * @param roles {RoleEntity[]} Roles to be assigned
   * @param creator {UserEntity} User creating this user
   */
  // @Transactional()
  async createUserAndMeta(
    user: CreateUserDto,
    roles: RoleEntity[],
    creator: any,
    priority: number,
  ): Promise<UserEntity> {
    const meta = await this.userMetaService.createUserMeta();
    const userEntity: UserEntity = await this.repository.create(user);
    userEntity.userMeta = meta;
    userEntity.fullName = user.firstName + ' ' + user.lastName;
    userEntity.roles = roles;
    userEntity.creatorId = creator;
    userEntity.priority = priority;
    const userEntityPromise = this.repository.save(userEntity, {
      transaction: false,
    });

    const [error, userEntityObject] = await UtilsService.trycatch(
      userEntityPromise,
    );
    if (error) {
      if (Number(error.code) === DUPLICATE_ERROR) {
        throw new ConflictException(Messages.USER.ALREADY_EXISTS);
      } else if (error.message === Messages.USER.INVALID_PHONE) {
        throw error;
      }
      throw new ServerFailedException();
    }
    return userEntityObject;
  }

  deleteUserAndMeta(userMetaUuid: string) {
    // Due to 'Cascade on delete', deleting the meta also deletes the user
    return this.userMetaService.delete(userMetaUuid);
  }

  async getAllByAccountId(
    accountId: number,
    options: IPaginationOptions,
    query: string,
  ): Promise<Pagination<UserEntity>> {
    return this.getAllByField(
      'accountId',
      accountId,
      [],
      UsersListSelectFields('user'),
      { query, fields: this.searchFields },
      options,
    );
  }

  async getOneByUuidAccountId(
    uuid: string,
    accountId: number,
  ): Promise<UserEntity> {
    const user: UserEntity = await this.getOneByUuid(
      uuid,
      [
        'user.account',
        'user.roles',
        'roles.permissions',
        'user.resources',
        'resources.floor',
        'floor.building',
        { relation: 'building.campus', alias: 'buildingCampus' },
        'resources.campus',
        { relation: 'floor.campus', alias: 'floorCampus' },
      ],
      [
        ...UsersListSelectFields('user'),
        'account.id',
        'account.uuid',
        'floor',
        'campus',
        'building',
        'account.name',
        'resources',
        'buildingCampus',
        'floorCampus',
      ],
    );
    return user;
  }

  async getUserMeta(userUuid: string): Promise<UserEntity> {
    return this.getOneByUuid(
      userUuid,
      ['user.userMeta', 'user.roles'],
      [
        'user.uuid',
        'user.firstName',
        'user.lastName',
        'user.fullName',
        'user.profileImage',
        'roles',
        'userMeta.lastLoginAt',
        'userMeta.createdAt',
        'userMeta.lastFailedLoginAt',
        'userMeta.lastLogoutAt',
      ],
    );
  }

  getAllSuperAdmins(
    options: IPaginationOptions,
    search?: string,
  ): Promise<Pagination<UserEntity>> {
    const queryBuilder = this.repository
      .createQueryBuilder(this.name)
      .innerJoinAndSelect(`${this.name}.roles`, 'roles')
      .select(UsersListSelectFields(this.name))
      .where('roles.name = :roleType', { roleType: RoleType.SUPER_ADMIN });

    if (search) {
      UtilsService.applySearchFilter(
        { query: search, fields: this.searchFields },
        queryBuilder,
        this.name,
      );
    }

    return paginate<UserEntity>(queryBuilder, options);
  }

  async getAllUsers(page: number, limit: number, search: string) {
    const users: any = await this.getAllWithoutAccount(
      { limit, page, route: '/user/investor' },
      null,
      ['user.roles'],
      search,
      `roles.name NOT IN ('${RoleType.SUPER_ADMIN}','${RoleType.USER_ADMIN}') AND user.status = 'Active'`,
      [{ key: 'user.createdAt', value: 'DESC' }],
    );

    return users;
  }

  async deleteUserThroughUuid(uuid: string) {
    const userFound = await this.repository.findOne({
      where: {
        uuid: uuid,
      },
    });
    if (!userFound) {
      return Messages.USER.DOES_NOT_EXIST;
    } else {
      await userFound.remove();
      return Messages.USER.USER_SUCCESSFULLY_DELETED;
    }
  }
}
