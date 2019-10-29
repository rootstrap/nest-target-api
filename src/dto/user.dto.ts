import { IsEmail, IsNumber } from 'class-validator'
import { Expose } from 'class-transformer'

import { User } from '../users/user.entity'

export default class UserDto {
  @IsNumber()
  @Expose()
  readonly id: number

  @IsEmail()
  @Expose()
  readonly email: string

  static from(user: User): UserDto {
    return {
      id: user.id,
      email: user.email,
    }
  }
}
