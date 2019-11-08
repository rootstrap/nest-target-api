import request from 'supertest'
import { Test } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { INestApplication } from '@nestjs/common'

import { AuthModule } from 'auth/auth.module'
import { TopicsModule } from 'topics/topics.module'
import { TargetsModule } from 'targets/targets.module'
import { ConfigModule } from 'config/config.module'
import { TopicsRepoService } from 'test/topics-repo.service'
import { UsersRepoService } from 'test/users-repo.service'
import { TargetsRepoService } from 'test/targets-repo.service'
import { Topic } from 'topics/topic.entity'
import { User } from 'users/user.entity'
import { Target } from 'targets/target.entity'
import applyGlobalConfig from 'apply-global-conf'
import ormAsyncOptions from 'test/orm-config'

describe('DELETE /targets/:id', () => {
  let app: INestApplication
  let users
  let user
  let accessToken
  let targets
  let target

  const deleteTargets = (targetId, { authorized = true } = {}) => {
    const deleteTargets = request(app.getHttpServer()).delete(
      `/targets/${targetId}`,
    )
    authorized && deleteTargets.set('Authorization', `Bearer ${accessToken}`)
    return deleteTargets
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

    target = await targets.mockOne(user)
  })

  afterEach(async () => app.close())

  describe('when sending correct token', () => {
    describe('when the user has a target with correct id', () => {
      it('should return 204', async () => {
        await deleteTargets(target.id).expect(204)
      })

      it('should delete the target', async () => {
        await deleteTargets(target.id)
        const after = await targets.findById(target.id)
        expect(after).toBeUndefined()
      })
    })

    describe('when the target does not belong to user', () => {
      it('should return 404', async () => {
        const { user: otherUser } = await users.mockWithToken(app)
        const target = await targets.mockOne(otherUser)
        await deleteTargets(target.id).expect(404)
      })
    })
  })

  describe('when sending no token', () => {
    it('should return 401', async () => {
      await deleteTargets(target.id, { authorized: false }).expect(401)
    })
  })
})
