import { Test } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { INestApplication } from '@nestjs/common'

import { AuthModule } from '../../src/auth/auth.module'
import { TopicsModule } from '../../src/topics/topics.module'
import { TargetsModule } from '../../src/targets/targets.module'
import { TargetsService } from '../../src/targets/targets.service'
import { ConfigModule } from '../../src/config/config.module'
import { TopicsRepoService } from '../topics-repo.service'
import { UsersRepoService } from '../users-repo.service'
import { TargetsRepoService } from '../targets-repo.service'
import { Topic } from '../../src/topics/topic.entity'
import { User } from '../../src/users/user.entity'
import { Target } from '../../src/targets/target.entity'
import applyGlobalConfig from '../../src/apply-global-conf'
import ormAsyncOptions from '../orm-config'

describe('POST /targets', () => {
  let app: INestApplication
  let targetsHelper
  let users
  let user
  let targetsService
  const realDate = Date

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync(ormAsyncOptions),
        TypeOrmModule.forFeature([Topic, User, Target]),
        AuthModule,
        ConfigModule,
        TopicsModule,
        TargetsModule,
      ],
      providers: [TopicsRepoService, UsersRepoService, TargetsRepoService],
    }).compile()

    app = module.createNestApplication()
    applyGlobalConfig(app)
    await app.init()

    users = module.get<UsersRepoService>(UsersRepoService)
    targetsHelper = module.get<TargetsRepoService>(TargetsRepoService)
    targetsService = module.get<TargetsService>(TargetsService)

    user = await users.mockOne()

    await targetsHelper.mockMany(10, user)
    
    const inOneMonth = new Date()
    inOneMonth.setMonth(inOneMonth.getMonth() + 1)

    jest.spyOn(Date, 'now').mockImplementation(() => inOneMonth.getTime())
  })

  describe('when the time comes', () => {
    it('should delete the targets', async () => {
      await targetsService.cleanOldTargets()
      const lastTarget = await targetsHelper.last()
      expect(lastTarget).toBeUndefined()
    })
  })

  afterAll(async () => {
    global.Date = realDate
    await app.close()
  })
})
