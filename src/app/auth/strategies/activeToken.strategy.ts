import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { JwtPayload } from '../types'

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // jwtFromRequest: ExtractJwt.fromExtractors([
      //   ExtractJwt.fromAuthHeaderAsBearerToken(),
      //   ExtractJwt.fromUrlQueryParameter('accessToken'),
      // ]),
      ignoreExpiration: false, // default
      secretOrKey: configService.get<string>('auth.access_token_secret'),
    })
  }

  validate(payload: JwtPayload) {
    if (payload instanceof Array) {
      // Just for test
      throw new UnauthorizedException('Custom unauthorized')
    }

    return payload
    // payload jwt token decode
  } // req.user
}
