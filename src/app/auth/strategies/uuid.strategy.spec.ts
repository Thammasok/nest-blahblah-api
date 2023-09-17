import PrismaClient from '@prisma/client'
import * as uuid from 'uuid'
import { ConfigService } from '@nestjs/config'

import { PrismaService } from '../../../helpers/prisma/prisma.service'
import { UuidStrategy } from './uuid.strategy'

// Mocking data
const uuidResult = 'random-uuid-12345'

jest.mock('uuid', () => ({ v4: () => uuidResult }))

jest.mock('@prisma/client', () => {
  const countResult = 0
  const mockAccountCount = jest.fn().mockResolvedValueOnce(countResult)

  return {
    PrismaClient: jest.fn().mockImplementation(() => {
      return {
        account: {
          count: mockAccountCount,
        },
      }
    }),
  }
})

describe('UUID Strategy', () => {
  let configService: ConfigService
  let uuidStrategy: UuidStrategy
  let prismaService: PrismaService

  beforeEach(() => {
    configService = new ConfigService()
    prismaService = new PrismaService(configService)
    uuidStrategy = new UuidStrategy(prismaService)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('UUID Strategy', () => {
    it("getAccountUUID don't have uuid", async () => {
      const uid = await uuidStrategy.getAccountUUID()

      expect(uuid.v4).toBeCalled
      expect(PrismaClient).toBeCalled
      expect(uuidStrategy.getAccountUUID).toBeCalled
      expect(uid).toBe(uuidResult)
    })
  })
})
