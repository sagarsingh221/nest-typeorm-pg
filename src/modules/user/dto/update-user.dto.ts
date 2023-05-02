import { OmitType } from '@nestjs/swagger';
import { CreateUserDto } from '@modules/user/dto/create-user.dto';

export class UpdateUserDto extends OmitType(CreateUserDto, ['accountId']) {}
