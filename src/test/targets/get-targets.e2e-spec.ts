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
import ormAsyncOptions from 'test/orm-config'

describe('GET /targets', () => {
  let app: INestApplication
  let users
  let user
  let accessToken
  let targets

  const getTargets = ({ authorized = true } = {}) => {
    const getTargets = request(app.getHttpServer()).get('/targets')

    authorized && getTargets.set('Authorization', `Bearer ${accessToken}`)
    return getTargets.expect('Content-Type', /json/)
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

    users = module.get<UsersRepoService>(UsersRepoService)
    targets = module.get<TargetsRepoService>(TargetsRepoService)
    ;({ user, accessToken } = await users.mockWithToken(app))
  })

  afterEach(async () => await app.close())

  describe('when sending correct token', () => {
    describe('when the user has no targets', () => {
      it('should return 200', async () => {
        await getTargets().expect(200)
      })

      it('should return the empty array', async () => {
        const { body } = await getTargets()
        expect(body).toEqual([])
      })
    })

    describe('when the user has targets', () => {
      it('should return 200', async () => {
        await targets.mockMany(3, user)
        await getTargets().expect(200)
      })

      it('should return the user targets', async () => {
        const mockTargets = await targets.mockMany(3, user)
        const { body } = await getTargets()
        expect(body).toEqual(TargetDto.fromArray(mockTargets))
      })
    })
  })

  describe('when sending no token', () => {
    it('should return 401', async () => {
      await getTargets({ authorized: false }).expect(401)
    })
  })
})
