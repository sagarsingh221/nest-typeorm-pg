import { JwtPayloadDto, LoginDto } from '@modules/auth/dto';
import { UserEntity } from '@modules/user/entities';
import { UserMetaService, UserService } from '@modules/user/services';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Messages, UserStatus } from '@src/commons/constants';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private userMetaService: UserMetaService,
  ) {}

  async login({ email, password }: LoginDto): Promise<any> {
    const user: UserEntity = await this.userService.getOneByField(
      'email',
      email,
      ['user.roles', 'roles.permissions'],
      ['user', 'roles', 'permissions'],
    );
    if (!user) {
      throw new BadRequestException(Messages.INVALID_CREDENTIAL);
    }

    const isPasswordMatch = await user.validatePassword(password);

    if (!isPasswordMatch) {
      await this.userMetaService.updateLoginMeta(user.userMetaId, false);
      throw new BadRequestException(Messages.INVALID_CREDENTIAL);
    }

    // Unverified users are not allowed to login
    if (user.status === UserStatus.Unverified) {
      throw new BadRequestException(Messages.USER.UNVERIFIED);
    }

    await this.userMetaService.updateLoginMeta(user.userMetaId);

    const token = this.createToken(user);
    const roles = user.roles.map((role) => role.name);
    return { user, token, roles };
  }

  async logout(user: JwtPayloadDto) {
    const userEntity: UserEntity = await this.userService.getOneByField(
      'uuid',
      user.uuid,
    );
    return this.userMetaService.updateLogoutMeta(userEntity.userMetaId);
  }

  private createToken(user: UserEntity): string {
    const payload: JwtPayloadDto = {
      id: user.id,
      uuid: user.uuid,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      profileImage: user.profileImage,
      phone: user.phone,
      status: user.status,
      roles: [],
      permissions: [],
    };

    user.roles.forEach((role) => payload.roles.push(role.name));

    const permissions = user?.roles?.reduce((accumulator, role) => {
      const perms = role?.permissions?.reduce((acc, permission) => {
        if (
          !accumulator.find(
            (accPermission) => accPermission.id === permission.id,
          )
        ) {
          return acc.concat({
            id: permission.id,
          });
        }
        return acc;
      }, []);
      return accumulator.concat(perms);
    }, []);

    payload.permissions = permissions;

    return this.jwtService.sign(payload);
  }
}
