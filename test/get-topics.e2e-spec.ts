import * as request from 'supertest'
import { Test } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { INestApplication } from '@nestjs/common'

import { AuthModule } from '../src/auth/auth.module'
import { TopicsModule } from '../src/topics/topics.module'
import { ConfigService } from '../src/config/config.service'
import { ConfigModule } from '../src/config/config.module'
import { TopicsRepoService } from './topics-repo.service'
import { UsersRepoService } from './users-repo.service'
import { Topic } from '../src/topics/topic.entity'
import { User } from '../src/users/user.entity'
import applyGlobalConfig from '../src/apply-global-conf'

const ormAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) =>  configService.ormConfig,
  inject: [ConfigService],
}

describe('POST /auth/signup', () => {
  let app: INestApplication
  let topics
  let users
  let token
  const email = 'user@example.com'
  const password = 'password'
  let mockTopics = ['Football', 'Sports', 'Outdoors']

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
    await topics.clear()
    await users.clear()
    await users.create(email, password)
    mockTopics.forEach(async topic => await topics.create(topic))
    mockTopics = await topics.all()

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect('Content-Type', /json/)

    token = response.body.access_token
  })

  describe('when sending correct token', () => {
    it('should return the list of topics', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/topics')
        .set('Authorization', `Bearer ${token}`)
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
    await users.clear()
    await app.close()
  })
})
