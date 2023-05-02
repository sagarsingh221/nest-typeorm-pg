import { Repository, EntityRepository } from 'typeorm';
import { UserEntity } from '@modules/user/entities';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {}
