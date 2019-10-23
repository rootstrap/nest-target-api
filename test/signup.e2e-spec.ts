import * as request from 'supertest'
import { Test } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { INestApplication } from '@nestjs/common'

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

describe('POST /auth/signup', () => {
  let app: INestApplication
  let users

  const performSignup = (email, password?) =>
    request(app.getHttpServer())
      .post('/auth/signup')
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
      response = await performSignup('test@example.com', 'test')
        .expect(201)
    })

    it('should return the new user DTO', async () => {
      const user = await users.getLastUser()
      expect(response.body).toEqual(new UserDto(user))
    })
  })

  describe('when sending a taken email', () => {
    it(`should return 422`, () => {
      return performSignup('test@example.com', 'test')
       .expect(422)
    })
  })

  describe('when sending an invalid email', () => {
    it(`should return 400`, () => {
      return performSignup('test@example', 'test')
       .expect(400)
    })
  })

  describe('when sending with missing parameters', () => {
    it(`should return 400`, () => {
      return performSignup('test@example')
       .expect(400)
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
