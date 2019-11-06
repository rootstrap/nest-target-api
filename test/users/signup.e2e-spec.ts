import request from 'supertest'
import { Test } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { INestApplication } from '@nestjs/common'

import { AuthModule } from '../../src/auth/auth.module'
import { ConfigModule } from '../../src/config/config.module'
import { UsersRepoService } from '../users-repo.service'
import { UserDto } from '../../src/dto'
import { User } from '../../src/users/user.entity'
import applyGlobalConfig from '../../src/apply-global-conf'
import ormAsyncOptions from '../orm-config'

describe('POST /auth/signup', () => {
  let app: INestApplication
  let users

  const performSignup = (email, password?) =>
    request(app.getHttpServer())
      .post('/auth/signup')
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
  })

  afterEach(async () => app.close())

  describe('when sending correct data', () => {
    it('should return 201', async () => {
      await performSignup('test@example.com', 'test')
        .expect(201)
    })

    it('should return the new user DTO', async () => {
      const { body } = await performSignup('test@example.com', 'test')
      const user = await users.last()
      expect(body).toEqual(UserDto.from(user))
    })
  })

  describe('when using a taken email', () => {
    it('should return 422', async () => {
      const { email } = await users.mockOne()
      await performSignup(email, 'test')
        .expect(422)
    })
  })

  describe('when using an invalid email', () => {
    it('should return 400', async () => {
      await performSignup('invalid@email', 'test')
        .expect(400)
    })
  })

  describe('when there are missing parameters', () => {
    it('should return 400', async () => {
      await performSignup('test@example')
        .expect(400)
    })
  })
})
