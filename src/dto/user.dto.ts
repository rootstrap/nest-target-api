import { IsEmail, IsNumber } from 'class-validator'

export default class UserDto {
  constructor(user) {
    this.id = user.id
    this.email = user.email
  }
  @IsNumber()
  readonly id: number

  @IsEmail()
  readonly email: string
}
