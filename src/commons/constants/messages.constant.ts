/**
 * @readonly
 * @type {Object}
 * This object contains messages which will be used by exceptions given out of the box by nest js framework
 */
export const Messages = {
  SERVER_ERROR: 'Something bad happened. Please try again later.',
  TOKEN_EXPIRED:
    'Your token is malformed or expired, please login to obtain a new one',
  INVALID_REQUEST: 'Invalid request.',
  NOT_FOUND: "Record doesn't exist",
  RECORD_EXPIRED: "Record doesn't exist or expired.",
  BAD_LOGIN_REQUEST: 'Email or password is invalid.',
  INVALID_CREDENTIAL:
    'Sign In Failed. Please check your credentials and try again.',
  PASSWORDS_MISMATCH: 'Passwords do not match.',
  DUPLICATE_USER: 'User with these credentials already exist.',
  DUPLICATE_RECORD: 'This record already exist.',
  RECORD_UPDATED: 'User record updated.',
  PASSWORD_UPDATED: 'Password updated successfully.',
  FOREIGN_ID_MISSING: 'Record id is missing or incorrect.',
  DOMAIN_HEADER_MISSING: 'Domain header is missing.',
  INVALID_DOMAIN: 'Invalid domain.',
  ROLE_PERMISSION_ERROR:
    'Role cant be created without permissions hint: permissions you are attaching doesnt exist',
  PERMISSION_OWNERSHIP_ERROR:
    'Permission you are trying to delete doesnt belong to you',
  ROLE_ERROR: "roles you are trying to assign doesn't exist ",
  CONFLICTING_ROLE_REMOVE:
    ' The role/roles you are trying to uassign has been already unassigned',
  CONFLICTING_ROLE_ADD:
    'The role/roles you are trying to assign has been already assigned',
  INVALID_UUID: 'Invalid UUID.',
  ACCOUNT: {
    ID_MISSING: 'Account id is missing',
    NOT_FOUND: 'Account does not exist',
    ALREADY_EXISTS: 'The account with this sub-domain already exists.',
    ACTIVE: 'The account is Active.',
    INACTIVE: 'The account is Inactive.',
  },
  USER: {
    ALREADY_EXISTS: 'User with this email already exists.',
    INVALID_PHONE: 'Invalid phone number. Must contain 10 digits',
    NOT_SUPER_ADMIN: 'User is not Super Admin',
    UNVERIFIED: 'User is unverified',
    DOES_NOT_EXIST: 'User does not exist.',
    EMAIL_ALREADY_EXISTS: 'Email already exists.',
    CANNOT_DELETE_OWN_ACCOUNT: 'You can not delete your own account',
    ADMIN_CANNOT_DELETED: 'Default Super Admin cannot be deleted.',
    ACCESS_DENIED: 'Delete Access Denied.',
    USER_SUCCESSFULLY_DELETED: 'User Deleted Successfully',
    ACCOUNT_SUSPENDED: 'Your account has been suspended!',
  },
  PLAN: {
    ALREADY_EXISTS: 'Plan of this Investor already exists.',
    INVESTMENT_OF_THIS_MONTH: 'Investment of this month is not Exist.',
  },
  STATEMENT: {
    ALREADY_EXISTS: 'Statement of this Month already exists.',
  },
};
