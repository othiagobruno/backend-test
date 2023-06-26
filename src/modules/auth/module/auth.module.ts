import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/modules/user/module/user.module';
import { AuthService } from '../services/auth.service';
import { JwtStrategy } from '../strategy/jwt.strategy';
import { AuthController } from '../infra/http/controllers/auth.controller';
import { PrismaModule } from 'src/database/prisma/module/prisma.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async () => ({
        secret: process.env.APP_KEY,
        signOptions: {
          expiresIn: '5m',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
