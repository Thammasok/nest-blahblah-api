import { Test, TestingModule } from '@nestjs/testing'
import { WalletCategoryController } from './wallet-category.controller'

describe('WalletCategoryController', () => {
  let controller: WalletCategoryController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletCategoryController],
    }).compile()

    controller = module.get<WalletCategoryController>(WalletCategoryController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
