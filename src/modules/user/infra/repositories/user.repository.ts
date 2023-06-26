import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/services/prisma.service';
import { IUpdateUserDto } from '../../dtos/IUpdateUser.dto';
import { ICreateUserDto } from '../../dtos/ICreateUser.dto';

@Injectable()
export class UserRepository {
  constructor(private database: PrismaService) {}

  async create(data: ICreateUserDto) {
    return await this.database.user.create({ data });
  }

  async findAll() {
    return await this.database.user.findMany();
  }

  async findOne(id: number) {
    return await this.database.user.findUnique({ where: { id } });
  }

  async update(id: number, data: IUpdateUserDto) {
    return await this.database.user.update({ where: { id }, data });
  }

  async remove(id: number) {
    return await this.database.user.delete({ where: { id } });
  }

  async findByEmail(email: string) {
    return await this.database.user.findUnique({ where: { email } });
  }
}
