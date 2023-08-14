import PrismaClient from '@prisma/client'
import { PrismaService } from '../../../prisma/prisma.service'
import { UuidStrategy } from './uuid.strategy'
import { ConfigService } from '@nestjs/config'
import * as uuid from 'uuid'

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

describe('CatsController', () => {
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
    it("getUUID don't have uuid", async () => {
      const uid = await uuidStrategy.getUUID()

      expect(uuid.v4).toBeCalled
      expect(PrismaClient).toBeCalled
      expect(uuidStrategy.getUUID).toBeCalled
      expect(uid).toBe(uuidResult)
    })
  })
})
