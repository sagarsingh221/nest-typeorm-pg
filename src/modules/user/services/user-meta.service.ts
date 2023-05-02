import { Injectable, NotFoundException } from '@nestjs/common';
import { UserMeta } from '@modules/user/entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from '@utils/services/abstract.service';

@Injectable()
export class UserMetaService extends AbstractService<UserMeta> {
  constructor(
    @InjectRepository(UserMeta)
    repository: Repository<UserMeta>,
  ) {
    super('userMeta', repository);
  }

  async createUserMeta() {
    const res = this.repository.create();
    return this.repository.save(res, { transaction: false });
  }

  async updateLoginMeta(userMetaId: number, isSuccess = true) {
    const field = isSuccess ? 'lastLoginAt' : 'lastFailedLoginAt';

    return this.repository.update(userMetaId, { [field]: new Date() });
  }

  async updateLogoutMeta(userMetaId: number) {
    return this.repository.update(userMetaId, {
      // FIXME: need to store timezoned UTC value
      lastLogoutAt: new Date().toLocaleDateString(),
    });
  }

  async delete(userMetaUuid: string) {
    const userMeta: UserMeta = await this.getOneByUuid(userMetaUuid, [
      'userMeta.user',
    ]);

    throw new NotFoundException();
  }
}
