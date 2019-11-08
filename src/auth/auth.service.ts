import { Injectable } from '@nestjs/common'
import { compare } from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { verify } from 'jsonwebtoken'

import { ConfigService } from 'config/config.service'
import { User } from 'users/user.entity'
import { UsersService } from 'users/users.service'
import { UserDto } from 'dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserDto> {
    const user = await this.usersService.findUserByEmail(email)
    if (user) {
      const passwordMatches = await compare(password, user.password)
      if (passwordMatches) {
        return user
      }
    }
    return null
  }

  validateJWT(token) {
    return new Promise((resolve, reject) => {
      verify(token, this.config.jwtSecret, result => {
        if (result instanceof Error) reject(result)
        else resolve(result)
      })
    })
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id }
    return {
      accessToken: this.jwtService.sign(payload),
    }
  }
}
