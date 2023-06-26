import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './modules/user/module/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/module/auth.module';
import { APP_GUARD } from '@nestjs/core';
import AuthJWTGuard from './modules/auth/strategy/jwt.guard';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UserModule, AuthModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthJWTGuard,
    },
  ],
})
export class AppModule {}
