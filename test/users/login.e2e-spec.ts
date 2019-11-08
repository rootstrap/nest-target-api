import request from 'supertest'
import { Test } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { INestApplication } from '@nestjs/common'

import { AuthModule } from '../../src/auth/auth.module'
import { ConfigModule } from '../../src/config/config.module'
import { UsersRepoService } from '../users-repo.service'
import { User } from '../../src/users/user.entity'
import applyGlobalConfig from '../../src/apply-global-conf'
import ormAsyncOptions from '../orm-config'

describe('POST /auth/login', () => {
  let app: INestApplication
  let users
  const email = 'user@example.com'
  const password = 'password'

  const performLogin = (email?, password?) =>
    request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect('Content-Type', /json/)

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync(ormAsyncOptions),
        TypeOrmModule.forFeature([User]),
        AuthModule,
        ConfigModule,
      ],
      providers: [UsersRepoService],
    }).compile()

    app = module.createNestApplication()
    applyGlobalConfig(app)
    await app.init()

    users = module.get<UsersRepoService>(UsersRepoService)
    await users.create(email, password)
  })

  afterEach(async () => app.close())

  describe('when using correct data', () => {
    it('should return 201', async () => {
      await performLogin(email, password).expect(201)
    })

    it('should return a new JWT', async () => {
      const { body } = await performLogin(email, password)
      expect(body).toMatchObject({
        accessToken: expect.any(String),
      })
    })
  })

  describe('when using incorrect data', () => {
    it('should return 401', async () => {
      return await performLogin(
        'fake-email@example.com',
        'fake-password',
      ).expect(401)
    })
  })
})
