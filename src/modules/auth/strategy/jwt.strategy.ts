import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/modules/user/services/user.service';

interface TokenPayload {
  userId: number;
  onlyRefresh?: boolean;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.APP_KEY,
    });
  }

  async validate(payload: TokenPayload) {
    if (payload.onlyRefresh) {
      throw new HttpException(
        'This token is only for refresh',
        HttpStatus.FORBIDDEN,
      );
    }

    return await this.userService.findOne(payload.userId);
  }
}
