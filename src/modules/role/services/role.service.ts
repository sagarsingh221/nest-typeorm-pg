import { CreateRoleDto } from '@modules/role/dto';
import { RoleEntity } from '@modules/role/entities';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleType } from '@src/commons/constants';
import { PermissionService } from '@src/modules/permission/services';
import { AbstractService, UtilsService } from '@utils/services';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class RoleService extends AbstractService<RoleEntity> {
  constructor(
    @InjectRepository(RoleEntity)
    repository: Repository<RoleEntity>,
    private readonly permissionService: PermissionService,
  ) {
    super('role', repository, ['name', 'description']);
  }

  async create(createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    const role = this.repository.create(createRoleDto);
    const permissions: any = createRoleDto.permissionUuids;

    role.permissions = permissions
      ? await this.permissionService.getAllFilteredUuids(permissions)
      : [];

    return this.repository.save(role);
  }

  async getOneByUuid(
    uuid: string,
    relations: any[] = [],
    select: string[] = null,
  ): Promise<RoleEntity> {
    const role: RoleEntity = await super.getOneByUuid(uuid, relations, select);
    return role;
  }

  async update(
    uuid: string,
    createRoleDto: CreateRoleDto,
  ): Promise<RoleEntity> {
    const role = await this.getOneByUuid(uuid, ['role.permissions']);
    const { name, description, permissionUuids } = createRoleDto;
    role.name = name;
    role.description = description;

    const updatedUuids: string[] = UtilsService.updatingUuids(
      role.permissions,
      permissionUuids,
    );

    role.permissions = updatedUuids
      ? await this.permissionService.getAllFilteredUuids(updatedUuids)
      : [];

    return await role.save();
  }

  async delete(uuid: string): Promise<DeleteResult> {
    await this.getOneByUuid(uuid);

    const deleted = await this.repository.delete({ uuid });

    if (deleted?.affected !== 1) {
      throw new BadRequestException();
    }

    return deleted;
  }

  async getRoleId(): Promise<RoleEntity> {
    const role: RoleEntity = await this.repository
      .createQueryBuilder('role')
      .where('role.name = :name', { name: RoleType.EMPLOYER })
      .getOne();

    return role;
  }
}
