import { Body, Controller, Post } from '@nestjs/common';
import { IsPublic } from 'src/modules/auth/decorators/rules';
import { ILoginDTO } from 'src/modules/auth/interfaces/dtos/ILogin.dto';
import { AuthService } from 'src/modules/auth/services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @Post('refresh')
  async refresh(@Body('refresh_token') refresh_token: string) {
    return await this.authService.refresh(refresh_token);
  }

  @IsPublic()
  @Post()
  async login(@Body() data: ILoginDTO) {
    return await this.authService.login(data);
  }
}
