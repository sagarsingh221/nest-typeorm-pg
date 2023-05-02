import { CreateRoleDto } from '@modules/role/dto';
import { RoleEntity } from '@modules/role/entities';
import { RoleService } from '@modules/role/services';
import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '@src/decorators';
import { RoleType } from '@commons/constants';

@ApiTags('Roles')
@ApiBearerAuth('JWT')
@Controller()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOperation({ summary: 'Create Role' })
  @Roles(RoleType.SUPER_ADMIN, RoleType.USER_ADMIN)
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @ApiOperation({ summary: 'Get Role by UUID' })
  @Roles(RoleType.SUPER_ADMIN, RoleType.USER_ADMIN)
  @Get(':uuid')
  async getOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ): Promise<RoleEntity> {
    return this.roleService.getOneByUuid(uuid);
  }

  @ApiOperation({ summary: 'Update Role by UUID' })
  @Roles(RoleType.SUPER_ADMIN, RoleType.USER_ADMIN)
  @Put(':uuid')
  update(
    @Param('uuid') uuid: string,
    @Body() createRoleDto: CreateRoleDto,
  ): Promise<RoleEntity> {
    return this.roleService.update(uuid, createRoleDto);
  }

  @ApiOperation({ summary: 'Delete Role' })
  @Roles(RoleType.SUPER_ADMIN, RoleType.USER_ADMIN)
  @HttpCode(204)
  @Delete(':uuid')
  delete(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.roleService.delete(uuid);
  }

  @ApiOperation({ summary: 'Get All Roles' })
  @Get()
  @Roles(RoleType.SUPER_ADMIN, RoleType.USER_ADMIN)
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  getAllRoles(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query('search') search: string,
  ) {
    return this.roleService.getAllWithoutAccount(
      { limit, page, route: '/role' },
      null,
      null,
      search,
    );
  }
}
