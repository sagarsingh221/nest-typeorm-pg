import { UserMeta } from '@modules/user/entities';
import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

@EntityRepository(UserMeta)
export class UserMetaRepository extends Repository<UserMeta> {}
