import { Module } from '@nestjs/common'
import { ThrottlerModule } from '@nestjs/throttler'
import { ConfigService } from '@nestjs/config'

import { RateLimitService } from 'src/libs/rate-limit/rate-limit.service'

const configService = new ConfigService()

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: configService.get('RATE_LIMIT_TTL') || 60,
      limit: configService.get('RATE_LIMIT_MAX') || 10,
    }),
  ],
  providers: [RateLimitService],
})
export class RateLimitModule {}
