export default class UserDto {
  constructor(user) {
    this.id = user.id
    this.email = user.email
  }
  readonly id: number
  readonly email: string
}
