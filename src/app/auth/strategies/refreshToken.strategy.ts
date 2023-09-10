import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Request } from 'express'
import { ForbiddenException, Injectable } from '@nestjs/common'
import { JwtPayload, JwtPayloadWithRt } from '../types'

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.refresh_token
        },
      ]),
      ignoreExpiration: false, // default
      secretOrKey: configService.get<string>('auth.refresh_token_secret'),
      passReqToCallback: true, // The req becomes accessible and is used below when authenticating the passport.
    })
  }

  validate(req: Request, payload: JwtPayload): JwtPayloadWithRt {
    const refreshToken = req?.cookies?.refresh_token

    if (!refreshToken) throw new ForbiddenException('Refresh token malformed')
    return {
      ...payload,
      refreshToken,
    }
  }
  // The reason why I did this part is that when doing /auth/refresh, I need to get a refresh-token from the get-current-user decorator.
  // Then, refresh is performed by comparing the refresh token and the hashed token.
}
