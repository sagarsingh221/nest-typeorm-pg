import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoleType } from '@src/commons/constants';
import { Roles } from '@src/decorators/roles.decorator';
import { AppService } from './app.service';

@ApiTags('Server Status')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Roles(RoleType.PUBLIC)
  @Get('/ping')
  statusCheck(): string {
    return this.appService.statusCheck();
  }
}
