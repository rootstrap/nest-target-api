import * as request from 'supertest'
import { Test } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { INestApplication, ValidationPipe } from '@nestjs/common'

import { AuthModule } from '../src/auth/auth.module'
import { ConfigService } from '../src/config/config.service'
import { ConfigModule } from '../src/config/config.module'
import { UsersRepoService } from './users-repo.service'
import { UserDto } from '../src/users/dto'
import { User } from '../src/users/user.entity'
import applyGlobalConfig from '../src/apply-global-conf'

const ormAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) =>  configService.ormConfig,
  inject: [ConfigService],
}

describe('POST /auth/login', () => {
  let app: INestApplication
  let users
  const mockUser = { email: 'user@example.com', password: 'password' }

  const performLogin = (email?, password?) =>
    request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect('Content-Type', /json/)

  beforeAll(async () => {
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
    await users.clear()
  })

  describe('when sending correct data', () => {
    let response

    it(`should return 201`, async () => {
      await users.create(mockUser.email, mockUser.password)
      response = await performLogin(mockUser.email, mockUser.password)
        .expect(201)
    })

    it('should return a new JWT', async () => {
      expect(response.body).toMatchObject({
        access_token: expect.any(String),
      })
    })
  })

  describe('when sending incorrect data', () => {
    it(`should return 401`, async () => {
      return await performLogin(mockUser.email)
        .expect(401)
    })
  })

  afterAll(async () => {
    await users.clear()
    await app.close()
  })
})
