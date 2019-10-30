import request from 'supertest'
import { Test } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { INestApplication } from '@nestjs/common'

import { AuthModule } from '../../src/auth/auth.module'
import { TopicsModule } from '../../src/topics/topics.module'
import { TargetsModule } from '../../src/targets/targets.module'
import { ConfigModule } from '../../src/config/config.module'
import { Topic } from '../../src/topics/topic.entity'
import { User } from '../../src/users/user.entity'
import { Target } from '../../src/targets/target.entity'
import { TargetDto } from '../../src/dto'
import applyGlobalConfig from '../../src/apply-global-conf'
import { TopicsRepoService } from '../topics-repo.service'
import { UsersRepoService } from '../users-repo.service'
import { TargetsRepoService } from '../targets-repo.service'
import { generateCluttered } from '../fixtures/target.fixture'
import ormAsyncOptions from '../orm-config'

describe('POST /targets', () => {
  let app: INestApplication
  let topics
  let users
  let user
  let accessToken
  let targets
  let mockTopic
  const mockTargets = generateCluttered(3)
  let postTargets

  beforeEach(async () => {
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

    postTargets = (target, topicId, config = {}) => {
      const postTargets = request(app.getHttpServer()).post('/targets')

      const { authorized = true, expectStatus = 201 } = config

      authorized && postTargets.set('Authorization', `Bearer ${accessToken}`)
      postTargets
        .send({ ...target, topicId })
        .expect('Content-Type', /json/)

      expectStatus && postTargets.expect(expectStatus)
      return postTargets
    }
  })

  afterEach(async () => {
    await app.close()
  })

  describe('when sending correct token', () => {
    describe('when sending correct data', () => {
      it('should return 201', async () => {
        await postTargets(mockTargets[0], mockTopic.id)
      })

      it('should return the newly created target', async () => {
        const response = await postTargets(mockTargets[0], mockTopic.id)
        const target = await targets.last()
        expect(response.body.target).toEqual(TargetDto.from(target))
      })
      
      describe('when there is another target nearby with the same topic', () => {
        it('should create a new match', async () => {
          const target = await targets.mockOneFromInfo(mockTargets[0], user, mockTopic)

          const response = await postTargets(mockTargets[1], mockTopic.id)
          expect(response.body.matches[0].id).toEqual(target.id)
        })
      })
    })

    describe('when sending incomplete data', () => {
      it('should return 400', async () => {
        await postTargets(mockTargets[1], undefined, { expectStatus: 400 })
      })
    })

    describe('when user has maxium targets', () => {
      it('should return 403', async () => {
        await targets.mockMany(10, user)
        await postTargets(mockTargets[1], mockTopic.id, { expectStatus: 403 })
      })
    })
  })

  describe('when sending no token', () => {
    it('should return 401', async () => {
      postTargets(mockTargets[1], mockTopic.id, { expectStatus: 401, authorized: false })
    })
  })
})
