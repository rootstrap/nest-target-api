import request from 'supertest'
import { Test } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { INestApplication } from '@nestjs/common'

import { AuthModule } from 'auth/auth.module'
import { TopicsModule } from 'topics/topics.module'
import { TargetsModule } from 'targets/targets.module'
import { ConfigModule } from 'config/config.module'
import { Topic } from 'topics/topic.entity'
import { User } from 'users/user.entity'
import { Target } from 'targets/target.entity'
import { TargetDto } from 'dto'
import applyGlobalConfig from 'apply-global-conf'
import { TopicsRepoService } from 'test/topics-repo.service'
import { UsersRepoService } from 'test/users-repo.service'
import { TargetsRepoService } from 'test/targets-repo.service'
import { generateCluttered } from 'test/fixtures/target.fixture'
import ormAsyncOptions from 'test/orm-config'

describe('POST /targets', () => {
  let app: INestApplication
  let topics
  let users
  let user
  let accessToken
  let targets
  let mockTopic
  const mockTargets = generateCluttered(3)

  const postTargets = (target, topicId, { authorized = true } = {}) => {
    const postTargets = request(app.getHttpServer()).post('/targets')

    authorized && postTargets.set('Authorization', `Bearer ${accessToken}`)
    postTargets.send({ ...target, topicId }).expect('Content-Type', /json/)

    return postTargets
  }

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
    ;({ user, accessToken } = await users.mockWithToken(app))
  })

  afterEach(async () => await app.close())

  describe('when sending correct token', () => {
    describe('when sending correct data', () => {
      it('should return 201', async () => {
        await postTargets(mockTargets[0], mockTopic.id).expect(201)
      })

      it('should return the newly created target', async () => {
        const { body } = await postTargets(mockTargets[0], mockTopic.id)
        const target = await targets.last()
        expect(body.target).toEqual(TargetDto.from(target))
      })

      describe('when there is another target nearby with the same topic', () => {
        it('should create a new match', async () => {
          const target = await targets.mockOneFromInfo(
            mockTargets[0],
            user,
            mockTopic,
          )

          const { body } = await postTargets(mockTargets[1], mockTopic.id)
          expect(body.matches[0].id).toEqual(target.id)
        })
      })
    })

    describe('when sending incomplete data', () => {
      it('should return 400', async () => {
        await postTargets(mockTargets[1], undefined).expect(400)
      })
    })

    describe('when user has maxium targets', () => {
      it('should return 403', async () => {
        await targets.mockMany(10, user)
        await postTargets(mockTargets[1], mockTopic.id).expect(403)
      })
    })
  })

  describe('when sending no token', () => {
    it('should return 401', async () => {
      await postTargets(mockTargets[1], mockTopic.id, {
        authorized: false,
      }).expect(401)
    })
  })
})
