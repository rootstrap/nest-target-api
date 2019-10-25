import * as request from 'supertest'
import { Test } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { INestApplication } from '@nestjs/common'

import { AuthModule } from '../src/auth/auth.module'
import { TopicsModule } from '../src/topics/topics.module'
import { ConfigModule } from '../src/config/config.module'
import { TopicsRepoService } from './topics-repo.service'
import { UsersRepoService } from './users-repo.service'
import { Topic } from '../src/topics/topic.entity'
import { User } from '../src/users/user.entity'
import applyGlobalConfig from '../src/apply-global-conf'
import ormAsyncOptions from './orm-config'

describe('GET /topics', () => {
  let app: INestApplication
  let topics
  let users
  let accessToken
  let mockTopics
  beforeAll(async () => {
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
    ; ({ accessToken } = await users.mockWithToken(app))
  })

  describe('when sending correct token', () => {
    it('should return the list of topics', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/topics')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect('Content-Type', /json/)

      expect(body).toEqual(expect.arrayContaining(mockTopics))
    })
  })

  describe('when sending no token', () => {
    it('should return 401', async () => {
      request(app.getHttpServer())
        .get('/topics')
        .expect('Content-Type', /json/)
        .expect(401)
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
