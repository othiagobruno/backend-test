import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from '../infra/repositories/user.repository';
import { ICreateUserDto } from '../dtos/ICreateUser.dto';
import { IUpdateUserDto } from '../dtos/IUpdateUser.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async create(data: ICreateUserDto) {
    const password = await bcrypt.hash(data.password, 10);
    return await this.userRepository.create({
      ...data,
      password,
    });
  }

  async findAll() {
    return await this.userRepository.findAll();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async update(id: number, data: IUpdateUserDto) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return await this.userRepository.update(id, {
      name: data.name,
    });
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return await this.userRepository.remove(id);
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }
}
