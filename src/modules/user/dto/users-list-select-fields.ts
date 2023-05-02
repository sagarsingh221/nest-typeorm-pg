export const UsersListSelectFields = (alias: string) => {
  const fields = [
    'uuid',
    'firstName',
    'lastName',
    'fullName',
    'email',
    'phone',
    'status',
    'profileImage',
  ];
  return fields.map((field) => `${alias}.${field}`);
};
