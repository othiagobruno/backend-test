import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { IsPublic } from 'src/modules/auth/decorators/rules';
import { GetUser } from 'src/modules/auth/decorators/user';
import { ICreateUserDto } from 'src/modules/user/dtos/ICreateUser.dto';
import { UserService } from 'src/modules/user/services/user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @IsPublic()
  @Post()
  async create(@Body() data: ICreateUserDto) {
    return this.userService.create(data);
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get('id')
  async findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @Put('id')
  async update(@Param('id') id: number, @Body() data, @GetUser() user: User) {
    if (user.id !== id) {
      throw new HttpException(
        'You can only delete your own user',
        HttpStatus.FORBIDDEN,
      );
    }
    return this.userService.update(id, data);
  }

  @Delete('id')
  async remove(@Param('id') id: number, @GetUser() user: User) {
    if (user.id !== id) {
      throw new HttpException(
        'You can only delete your own user',
        HttpStatus.FORBIDDEN,
      );
    }
    return this.userService.remove(id);
  }
}
