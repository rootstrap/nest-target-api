import { InjectRepository } from '@nestjs/typeorm'
import request from 'supertest'
import { Repository } from 'typeorm'
import { internet } from 'faker'

import { User } from '../src/users/user.entity'
import { hash } from 'bcrypt'
import { ConfigService } from '../src/config/config.service'

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

  async mockWithToken(app): Promise<{ user: User, accessToken: string }> {
    const email = internet.email()
    const password = internet.password()

    const user = await this.create(email, password)
    const { body: { accessToken } } = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password })
      .expect('Content-Type', /json/)

    return {
      user,
      accessToken,
    }
  }
}
