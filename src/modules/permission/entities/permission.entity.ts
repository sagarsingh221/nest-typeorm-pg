import { AbstractEntity } from '@commons/entities';
import { Column, Entity, ManyToMany } from 'typeorm';
import { RoleEntity } from '@modules/role/entities';

@Entity('permission')
export class PermissionEntity extends AbstractEntity {
  @Column({ length: 80 })
  name: string;

  @Column({ length: 100, nullable: true })
  description: string;

  @ManyToMany(() => RoleEntity, (role) => role.permissions)
  roles: RoleEntity[];
}
