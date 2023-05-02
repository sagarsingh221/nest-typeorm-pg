import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from '@modules/role/entities';
import { Repository } from 'typeorm';
import { UserEntity, UserMeta } from '@modules/user/entities';
import { RoleType, UserStatus } from '@commons/constants';
import * as argon2 from 'argon2';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(UserMeta)
    private readonly userMetaRepository: Repository<UserMeta>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async seed() {
    await this.seedPredefinedRoles();
    await this.seedSuperAdminUser();
  }

  async seedPredefinedRoles() {
    const superAdminRoleExist: RoleEntity = await this.roleRepository.findOne({
      name: RoleType.SUPER_ADMIN,
    });
    if (!superAdminRoleExist) {
      await this.roleRepository.insert({
        name: RoleType.SUPER_ADMIN,
        description:
          'Salary-M24 Admin to manage all user accounts, admin accounts and system settings.',
      });
    }

    const userAdminRoleExist: RoleEntity = await this.roleRepository.findOne({
      name: RoleType.USER_ADMIN,
    });
    if (!userAdminRoleExist) {
      await this.roleRepository.insert({
        name: RoleType.USER_ADMIN,
        description: 'Has the ability to manage all the users in the account.',
      });
    }

    const staffRoleExist: RoleEntity = await this.roleRepository.findOne({
      name: RoleType.STAFF,
    });
    if (!staffRoleExist) {
      await this.roleRepository.insert({
        name: RoleType.STAFF,
        description: 'Staff that will manage the users.',
      });
    }

    const employerRoleExist: RoleEntity = await this.roleRepository.findOne({
      name: RoleType.EMPLOYER,
    });
    if (!employerRoleExist) {
      await this.roleRepository.insert({
        name: RoleType.EMPLOYER,
        description: 'A person or organization that employs people.',
      });
    }

    const employeeRoleExist: RoleEntity = await this.roleRepository.findOne({
      name: RoleType.EMPLOYEE,
    });
    if (!employeeRoleExist) {
      await this.roleRepository.insert({
        name: RoleType.EMPLOYEE,
        description:
          'A person employed for wages or salary, especially at non-executive level.',
      });
    }
  }

  async seedSuperAdminUser() {
    const superAdminRole: RoleEntity = await this.roleRepository.findOne({
      name: RoleType.SUPER_ADMIN,
    });
    const userExist: UserEntity = await this.userRepository.findOne({
      email: 'admin@salary.com',
    });
    if (!userExist) {
      const userMeta: UserMeta = this.userMetaRepository.create();

      const user: UserEntity = this.userRepository.create({
        firstName: 'Super',
        lastName: 'Admin',
        fullName: 'Super Admin',
        email: 'admin@salary.com',
        username: 'superadmin',
        password: await argon2.hash('123456'),
        phone: '1234567890',
        status: UserStatus.Active,
        userMeta: userMeta,
        roles: [superAdminRole],
        priority: 0,
      });

      await user.save();
    }
  }
}
