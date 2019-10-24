import { Test, TestingModule } from '@nestjs/testing'
import { PassportModule } from '@nestjs/passport'

import { TopicsController } from './topics.controller'
import { TopicsService } from './topics.service'
import { AuthService } from '../auth/auth.service'
import { mockAuthService } from '../auth/test/mocks'
import { mockTopicsService } from './mocks'

describe('Config Controller', () => {
  let controller: TopicsController
  let service: TopicsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [TopicsController],
      providers: [
        {
          provide: TopicsService,
          useValue: mockTopicsService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile()

    controller = module.get<TopicsController>(TopicsController)
    service = module.get<TopicsService>(TopicsService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('getTopics', () => {
    it('should call topicsService.all', async () => {
      const authServiceAll = jest.spyOn(service, 'all')
      await controller.getTopics()

      expect(authServiceAll).toHaveBeenCalled()
    })
  })
})
