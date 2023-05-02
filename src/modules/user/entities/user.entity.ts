import { UserStatus } from '@commons/constants';
import { AbstractEntity } from '@commons/entities';
import { RoleEntity } from '@modules/role/entities';
import { UserMeta } from '@modules/user/entities';
import { UtilsService } from '@src/utils/services';
import * as argon2 from 'argon2';
import {
  AfterLoad,
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
@Entity('user')
export class UserEntity extends AbstractEntity {
  @Column({ default: 0 })
  priority: number;

  @Column({ length: 80, nullable: true })
  firstName: string;

  @Column({ length: 80, nullable: true })
  lastName: string;

  @Column({ length: 160, nullable: true })
  fullName: string;

  @Column({ unique: true, length: 100, nullable: true })
  username: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column('json', { nullable: true })
  profileImage: object;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.Active })
  status: UserStatus;

  @ManyToMany(() => RoleEntity, (role) => role.users, { onDelete: 'CASCADE' })
  @JoinTable({ name: 'user_role' })
  roles: RoleEntity[];

  @OneToOne(() => UserMeta, (userMeta) => userMeta.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  userMeta: UserMeta;

  @Column({ type: 'integer' })
  userMetaId: number;

  // Which User created this User
  @ManyToOne(() => UserEntity, { onDelete: 'SET NULL', nullable: true })
  creator!: UserEntity;

  @Column({ type: 'integer', nullable: true })
  creatorId!: number;

  validatePassword(password: string): Promise<boolean> {
    return argon2.verify(this.password, password);
  }

  addRoles(attachedRoles: RoleEntity[]) {
    if (this.roles === null) {
      this.roles = new Array<RoleEntity>();
    }
    this.roles = attachedRoles;
  }

  @BeforeInsert()
  cleanPhone() {
    this.phone = UtilsService.cleanPhone(this.phone);
  }

  @AfterLoad()
  formatPhone() {
    this.phone = UtilsService.formatPhone(this.phone);
  }
}
