import { Test, TestingModule } from '@nestjs/testing'
import { WalletCategoryService } from './wallet-category.service'

describe('WalletCategoryService', () => {
  let service: WalletCategoryService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WalletCategoryService],
    }).compile()

    service = module.get<WalletCategoryService>(WalletCategoryService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
