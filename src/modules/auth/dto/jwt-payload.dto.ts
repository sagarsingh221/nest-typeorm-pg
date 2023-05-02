export class JwtPayloadDto {
  id: number;
  uuid: string;
  firstName: string;
  lastName: string;
  fullName: string;
  username: string;
  email: string;
  profileImage: object;
  phone: string;
  status: string;
  roles: string[];
  permissions: object[];
}

