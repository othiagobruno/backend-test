import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/prisma/module/prisma.module';
import { UserService } from '../services/user.service';
import { UserRepository } from '../infra/repositories/user.repository';
import { UserController } from '../infra/http/controllers/user.controller';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
