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
import applyGlobalConfig from '../../src/apply-global-conf'
import ormAsyncOptions from '../orm-config'

describe('DELETE /targets/:id', () => {
  let app: INestApplication
  let users
  let user
  let accessToken
  let targets
  let target
  let otherTarget

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
    const { user: otherUser } = await users.mockWithToken(app)

    target = await targets.mockOne(user)
    otherTarget = await targets.mockOne(otherUser)
  })    

  describe('when sending correct token', () => {

    describe('when the user has a target with correct id', () => {
      it('should return 204', async () => {
        await request(app.getHttpServer())
          .delete(`/targets/${target.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(204)
      })

      it('should delete the target', async () => {
        const after = await targets.findById(target.id)
        expect(after).toBeUndefined()
      })
    })

    describe('when the target does not belong to user', () => {
      it('should return 404', async () => {
        await request(app.getHttpServer())
          .delete(`/targets/${otherTarget.id}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(404)
      })
    })
  })

  describe('when sending no token', () => {
    it('should return 401', async () => {
      request(app.getHttpServer())
        .delete(`/targets/${target.id}`)
        .expect(401)
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
