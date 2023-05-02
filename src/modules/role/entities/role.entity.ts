import { AbstractEntity } from '@commons/entities';
import { Column, Entity, ManyToMany, JoinTable } from 'typeorm';
import { PermissionEntity } from '@modules/permission/entities';
import { UserEntity } from '@src/modules/user/entities';

@Entity('role')
export class RoleEntity extends AbstractEntity {
  @Column({ length: 80 })
  name: string;

  @Column({ length: 100, nullable: true })
  description: string;

  @ManyToMany(() => PermissionEntity, (permission) => permission.roles)
  @JoinTable()
  permissions: PermissionEntity[];

  @ManyToMany(() => UserEntity, (user) => user.roles, { onDelete: 'CASCADE' })
  users: UserEntity[];
}
