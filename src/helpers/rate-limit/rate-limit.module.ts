import { Module } from '@nestjs/common'
import { ThrottlerModule } from '@nestjs/throttler'
import { RateLimitService } from './rate-limit.service'
import { ConfigService } from '@nestjs/config'

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
