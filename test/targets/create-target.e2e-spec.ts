import request from 'supertest'
import { Test } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { INestApplication } from '@nestjs/common'

import { AuthModule } from '../../src/auth/auth.module'
import { TopicsModule } from '../../src/topics/topics.module'
import { TargetsModule } from '../../src/targets/targets.module'
import { ConfigModule } from '../../src/config/config.module'
import { TopicsRepoService } from '../topics-repo.service'
import { UsersRepoService } from '../users-repo.service'
import { TargetsRepoService } from '../targets-repo.service'
import { Topic } from '../../src/topics/topic.entity'
import { User } from '../../src/users/user.entity'
import { Target } from '../../src/targets/target.entity'
import { TargetDto } from '../../src/dto'
import applyGlobalConfig from '../../src/apply-global-conf'
import ormAsyncOptions from '../orm-config'

describe('POST /targets', () => {
  let app: INestApplication
  let topics
  let users
  let user
  let accessToken
  let targets
  let mockTopic
  const mockTarget = {
    title: 'Title',
    radius: 200,
    latitude: 43.019293,
    longitude: -23.981819,
  }

  const mockTarget2 = {
    title: 'Title2',
    radius: 200,
    latitude: 43.019293,
    longitude: -23.981819,
  }

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

    topics = module.get<TopicsRepoService>(TopicsRepoService)
    users = module.get<UsersRepoService>(UsersRepoService)
    targets = module.get<TargetsRepoService>(TargetsRepoService)

    mockTopic = await topics.mockOne()
    ; ({ user, accessToken } = await users.mockWithToken(app))
  })

  describe('when sending correct token', () => {
    describe('when sending correct data', () => {
      let response
      it('should return 201', async () => {
        response = await request(app.getHttpServer())
          .post('/targets')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ ...mockTarget, topicId: mockTopic.id })
          .expect('Content-Type', /json/)
          .expect(201)
      })

      it('should return the newly created target', async () => {
        const target = await targets.last()
        expect(response.body).toEqual(TargetDto.from(target))
      })
    })

    describe('when sending incomplete data', () => {
      it('should return 400', async () => {
        await request(app.getHttpServer())
          .post('/targets')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(mockTarget) // missing topicId
          .expect('Content-Type', /json/)
          .expect(400)
      })
    })

    describe('when user has maxium targets', () => {
      it('should return 403', async () => {
        await targets.mockMany(10, user)
        await request(app.getHttpServer())
          .post('/targets')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ ...mockTarget2, topicId: mockTopic.id })
          .expect('Content-Type', /json/)
          .expect(403)
      })
    })
  })

  describe('when sending no token', () => {
    it('should return 401', async () => {
      request(app.getHttpServer())
        .post('/targets')
        .expect('Content-Type', /json/)
        .expect(401)
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
