import { AuthRoleTypes, RoleType } from '@commons/constants';
import { JwtPayloadDto, LoginDto, LoginResponse } from '@modules/auth/dto';
import { AuthService } from '@modules/auth/services';
import { UserService } from '@modules/user/services';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUser, Roles } from '@src/decorators';

@ApiTags('Auth')
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @ApiOperation({ summary: 'Login' })
  @Roles(RoleType.PUBLIC)
  @Post('login')
  async adminLogin(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    const user = await this.authService.login(loginDto);
    return user;
  }

  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Logout' })
  @Post('logout')
  @Roles(...AuthRoleTypes)
  async logout(@AuthUser() user: JwtPayloadDto) {
    return this.authService.logout(user);
  }

  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'check login/logout(meta) details of a logged user',
  })
  @Get('meta')
  @Roles(...AuthRoleTypes)
  getUserMeta(@AuthUser() user: JwtPayloadDto): Promise<any> {
    return this.userService.getUserMeta(user.uuid);
  }
}
