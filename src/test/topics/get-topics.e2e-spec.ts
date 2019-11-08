import request from 'supertest'
import { Test } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { INestApplication } from '@nestjs/common'

import { AuthModule } from 'auth/auth.module'
import { TopicsModule } from 'topics/topics.module'
import { ConfigModule } from 'config/config.module'
import { Topic } from 'topics/topic.entity'
import { User } from 'users/user.entity'
import applyGlobalConfig from 'apply-global-conf'
import { TopicsRepoService } from 'test/topics-repo.service'
import { UsersRepoService } from 'test/users-repo.service'
import ormAsyncOptions from 'test/orm-config'

describe('GET /topics', () => {
  let app: INestApplication
  let topics
  let users
  let accessToken
  let mockTopics

  const getTopics = ({ authorized = true } = {}) => {
    const getTopics = request(app.getHttpServer()).get('/topics')
    authorized && getTopics.set('Authorization', `Bearer ${accessToken}`)
    return getTopics.expect('Content-Type', /json/)
  }

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync(ormAsyncOptions),
        TypeOrmModule.forFeature([Topic, User]),
        AuthModule,
        ConfigModule,
        TopicsModule,
      ],
      providers: [TopicsRepoService, UsersRepoService],
    }).compile()

    app = module.createNestApplication()
    applyGlobalConfig(app)
    await app.init()

    topics = module.get<TopicsRepoService>(TopicsRepoService)
    users = module.get<UsersRepoService>(UsersRepoService)

    mockTopics = await topics.mockMany(3)
    ;({ accessToken } = await users.mockWithToken(app))
  })

  afterEach(async () => app.close())

  describe('when sending correct token', () => {
    it('should return the 200', async () => {
      await getTopics().expect(200)
    })

    it('should return the list of topics', async () => {
      const { body } = await getTopics()
      expect(body).toEqual(expect.arrayContaining(mockTopics))
    })
  })

  describe('when sending no token', () => {
    it('should return 401', async () => {
      await getTopics({ authorized: false }).expect(401)
    })
  })
})
