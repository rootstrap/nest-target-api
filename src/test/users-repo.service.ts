import { InjectRepository } from '@nestjs/typeorm'
import request from 'supertest'
import { Repository } from 'typeorm'
import { internet } from 'faker'
import { hash } from 'bcrypt'

import { ConfigService } from 'config/config.service'
import { User } from 'users/user.entity'

export class UsersRepoService {
  private salts: number

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    config: ConfigService,
  ) {
    this.salts = config.bcryptSaltsNumber
  }

  async last(): Promise<User> {
    return this.usersRepository.findOne()
  }

  async create(email: string, password: string): Promise<User> {
    const hashedPassword = await hash(password, this.salts)
    const user = new User(email, hashedPassword)
    await this.usersRepository.save(user)
    return user
  }

  async mockOne(): Promise<User> {
    const email = internet.email()
    const password = internet.password()
    const hashedPassword = await hash(password, this.salts)
    const user = new User(email, hashedPassword)
    return this.usersRepository.save(user)
  }

  async mockWithToken(app): Promise<{ user: User; accessToken: string }> {
    const email = internet.email()
    const password = internet.password()

    const user = await this.create(email, password)
    const {
      body: { accessToken },
    } = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect('Content-Type', /json/)

    return {
      user,
      accessToken,
    }
  }
}
