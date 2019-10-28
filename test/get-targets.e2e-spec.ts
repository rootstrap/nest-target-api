import request from 'supertest'
import { Test } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { INestApplication } from '@nestjs/common'

import { AuthModule } from '../src/auth/auth.module'
import { TopicsModule } from '../src/topics/topics.module'
import { TargetsModule } from '../src/targets/targets.module'
import { ConfigModule } from '../src/config/config.module'
import { TopicsRepoService } from './topics-repo.service'
import { UsersRepoService } from './users-repo.service'
import { TargetsRepoService } from './targets-repo.service'
import { Topic } from '../src/topics/topic.entity'
import { User } from '../src/users/user.entity'
import { Target } from '../src/targets/target.entity'
import TargetIndexDto from '../src/dto/targets-index.dto'
import applyGlobalConfig from '../src/apply-global-conf'
import ormAsyncOptions from './orm-config'

describe('GET /targets', () => {
  let app: INestApplication
  let users
  let user
  let accessToken
  let targets
  let mockTargets

  const performRequest = () => request(app.getHttpServer())
    .get('/targets')
    .set('Authorization', `Bearer ${accessToken}`)
    .expect('Content-Type', /json/)

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
    targets = module.get<TargetsRepoService>(TargetsRepoService)

    ; ({ user, accessToken } = await users.mockWithToken(app))
  })

  describe('when sending correct token', () => {
    describe('when the user has no targets', () => {
      let response
      it('should return 200', async () => {
        response = await performRequest().expect(200)
      })

      it('should return the empty array', async () => {
        expect(response.body).toEqual([])
      })
    })

    describe('when the user has targets', () => {
      let response
      it('should return 200', async () => {
        mockTargets = await targets.mockMany(3, user)
        response = await performRequest().expect(200)
      })
      
      it('should return the user targets', () => {
        expect(response.body).toEqual(mockTargets.map(target => new TargetIndexDto(target)))
      })
    })
  })

  describe('when sending no token', () => {
    it('should return 401', async () => {
      performRequest().expect(401)
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
