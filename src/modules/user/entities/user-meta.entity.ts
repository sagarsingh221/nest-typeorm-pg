import { AbstractEntity } from '@src/commons/entities';
import { Column, Entity, OneToOne } from 'typeorm';
import { UserEntity } from '@modules/user/entities/user.entity';

@Entity({ name: 'user_meta' })
export class UserMeta extends AbstractEntity {
  @Column({ type: 'timestamptz', nullable: true })
  lastLoginAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  lastFailedLoginAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  lastLogoutAt: Date;

  @OneToOne(() => UserEntity, (user) => user.userMeta, { onDelete: 'CASCADE' })
  user: UserEntity;
}
