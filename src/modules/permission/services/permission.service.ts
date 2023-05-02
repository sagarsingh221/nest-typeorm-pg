import {
  CreatePermissionDto
} from '@modules/permission/dto';
import { PermissionEntity } from '@modules/permission/entities';
import {
  BadRequestException,
  Injectable
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from '@utils/services/abstract.service';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class PermissionService extends AbstractService<PermissionEntity> {
  constructor(
    @InjectRepository(PermissionEntity)
    repository: Repository<PermissionEntity>,
  ) {
    super('permission', repository, ['name', 'description']);
  }

  async create(
    createPermissionDto: CreatePermissionDto,
  ): Promise<PermissionEntity> {
    const permission = this.repository.create(createPermissionDto);

    return this.repository.save(permission);
  }

  async getOneByUuid(
    uuid: string,
    relations: any[] = [],
    select: string[] = null,
  ): Promise<PermissionEntity> {
    const permission: PermissionEntity = await super.getOneByUuid(
      uuid,
      relations,
      select,
    );
    return permission;
  }

  async update(
    uuid: string,
    createPermissionDto: CreatePermissionDto,
  ): Promise<PermissionEntity> {
    const permission = await this.getOneByUuid(uuid);

    permission.name = createPermissionDto.name;
    permission.description = createPermissionDto.description;

    await this.repository.save(permission);
    return permission;
  }

  async delete(uuid: string): Promise<DeleteResult> {
    await this.getOneByUuid(uuid);

    const deleted = await this.repository.delete({ uuid });

    if (deleted?.affected !== 1) {
      throw new BadRequestException();
    }

    return deleted;
  }
}
