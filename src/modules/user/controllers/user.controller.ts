import { JwtPayloadDto } from '@modules/auth/dto';
import { CreateUserDto, UpdateUserDto } from '@modules/user/dto';
import { UserEntity } from '@modules/user/entities';
import { UserService } from '@modules/user/services';
import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';
import { RoleType } from '@src/commons/constants';
import { AuthUser } from '@src/decorators';
import { Roles } from '@src/decorators/roles.decorator';
@ApiBearerAuth('JWT')
@ApiTags('User')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get All Users' })
  @Roles(RoleType.SUPER_ADMIN, RoleType.USER_ADMIN)
  @Get()
  async getActiveInvestors(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query('search') search: string,
  ) {
    return await this.userService.getAllUsers(page, limit, search);
  }

  @ApiOperation({ summary: 'Create User' })
  @Post()
  @Roles(RoleType.SUPER_ADMIN, RoleType.USER_ADMIN)
  create(
    @Body() createUserDto: CreateUserDto,
    @AuthUser() user: JwtPayloadDto,
  ): Promise<UserEntity> {
    return this.userService.create(createUserDto, user.id);
  }

  @ApiOperation({ summary: 'Updating User Data' })
  @Put(':uuid')
  @Roles(RoleType.SUPER_ADMIN, RoleType.USER_ADMIN)
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.userService.updateUser(uuid, updateUserDto);
  }

  @ApiOperation({ summary: 'Get User by UUID' })
  @Roles(RoleType.SUPER_ADMIN, RoleType.USER_ADMIN)
  @Get(':uuid')
  async getOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ): Promise<UserEntity> {
    return this.userService.getOneByUuid(uuid);
  }

  @ApiOperation({
    summary: 'Delete user through uuid',
  })
  @Delete(':uuid')
  @Roles(RoleType.PUBLIC)
  deleteUserUsingMetamask(@Param('uuid') uuid: string) {
    return this.userService.deleteUserThroughUuid(uuid);
  }
}
