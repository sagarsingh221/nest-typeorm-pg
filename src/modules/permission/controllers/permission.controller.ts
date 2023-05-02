import { CreatePermissionDto } from '@modules/permission/dto';
import { PermissionEntity } from '@modules/permission/entities';
import { PermissionService } from '@modules/permission/services';
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

@ApiTags('Permissions')
@ApiBearerAuth('JWT')
@Controller()
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @ApiOperation({ summary: 'Create Permission' })
  @Roles(RoleType.SUPER_ADMIN, RoleType.USER_ADMIN)
  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @ApiOperation({ summary: 'Get Permission by UUID' })
  @Roles(RoleType.SUPER_ADMIN, RoleType.USER_ADMIN)
  @Get(':uuid')
  async getOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ): Promise<PermissionEntity> {
    return this.permissionService.getOneByUuid(uuid);
  }

  @ApiOperation({ summary: 'Update Permission by UUID' })
  @Roles(RoleType.SUPER_ADMIN, RoleType.USER_ADMIN)
  @Put(':uuid')
  update(
    @Param('uuid') uuid: string,
    @Body() createPermissionDto: CreatePermissionDto,
  ): Promise<PermissionEntity> {
    return this.permissionService.update(uuid, createPermissionDto);
  }

  @ApiOperation({ summary: 'Delete Permission' })
  @Roles(RoleType.SUPER_ADMIN, RoleType.USER_ADMIN)
  @HttpCode(204)
  @Delete(':uuid')
  delete(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.permissionService.delete(uuid);
  }

  @ApiOperation({ summary: 'Get All Permissions' })
  @Roles(RoleType.SUPER_ADMIN, RoleType.USER_ADMIN)
  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  getAllPermissions(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query('search') search: string,
  ) {
    return this.permissionService.getAllWithoutAccount(
      { limit, page, route: '/permission' },
      null,
      null,
      search,
    );
  }
}
