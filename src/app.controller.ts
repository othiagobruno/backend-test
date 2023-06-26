import { Controller, Get } from '@nestjs/common';
import { IsPublic } from './modules/auth/decorators/rules';

@Controller()
export class AppController {
  @IsPublic()
  @Get()
  getHello(): string {
    return 'Hello World!';
  }
}
