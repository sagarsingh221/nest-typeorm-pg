export enum RoleType {
  SUPER_ADMIN = 'SUPER_ADMIN',
  USER_ADMIN = 'USER_ADMIN',
  STAFF = 'STAFF',
  EMPLOYER = 'EMPLOYER',
  EMPLOYEE = 'EMPLOYEE',
  PUBLIC = 'PUBLIC',
}

/** @constant AuthRoleTypes
 * List of RoleTypes which define the authenticated users (all except public)
 */
export const AuthRoleTypes = [
  RoleType.SUPER_ADMIN,
  RoleType.USER_ADMIN,
  RoleType.STAFF,
  RoleType.EMPLOYER,
  RoleType.EMPLOYEE,
];
