import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ILoginDTO } from '../interfaces/dtos/ILogin.dto';
import { UserService } from 'src/modules/user/services/user.service';
import { PrismaService } from 'src/database/prisma/services/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async refresh(refresh_token: string) {
    const userToken = await this.prisma.userTokens.findFirst({
      where: {
        refresh_token,
      },
    });

    if (!userToken) {
      throw new HttpException('Refresh token not found', 404);
    }

    const isRefreshTokenValid = await this.jwtService.verifyAsync(
      refresh_token,
    );

    if (!isRefreshTokenValid) {
      throw new HttpException('Refresh token not valid', 401);
    }

    const user = await this.userService.findOne(userToken.user_id);

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const payload = { userId: user.id };
    const currentDate = new Date();
    const date30Minutes = currentDate.setMinutes(currentDate.getMinutes() + 30);

    const token = this.jwtService.sign(payload, {
      expiresIn: '5m',
    });

    const refreshToken = this.jwtService.sign(
      { onlyRefresh: true },
      {
        expiresIn: '30m',
      },
    );

    await this.prisma.userTokens.update({
      where: {
        id: userToken.id,
      },
      data: {
        token,
        refresh_token: refreshToken,
        expires_in: new Date(date30Minutes),
      },
    });

    return { user, token, refresh_token: refreshToken };
  }

  async login({ email, password }: ILoginDTO) {
    const user = await this.userService.findByEmail(email);

    if (!user) throw new HttpException('User not found', 404);

    const checkPassword = await bcrypt.compare(password, user?.password || '');

    if (!checkPassword) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }

    user.password = undefined;

    const currentDate = new Date();
    const date30Minutes = currentDate.setMinutes(currentDate.getMinutes() + 30);

    const payload = { userId: user.id };

    const token = this.jwtService.sign(payload, {
      expiresIn: '5m',
    });

    const refreshToken = this.jwtService.sign(
      { onlyRefresh: true },
      {
        expiresIn: '30m',
      },
    );

    const userToken = await this.prisma.userTokens.findFirst({
      where: { user_id: user.id },
    });

    if (userToken) {
      await this.prisma.userTokens.update({
        where: {
          id: userToken.id,
        },
        data: {
          token,
          refresh_token: refreshToken,
          expires_in: new Date(date30Minutes),
        },
      });

      return { user, token, refresh_token: refreshToken };
    }

    await this.prisma.userTokens.create({
      data: {
        token,
        refresh_token: refreshToken,
        user_id: user.id,
        expires_in: new Date(date30Minutes),
      },
    });

    return { user, token, refresh_token: refreshToken };
  }
}
