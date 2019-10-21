import { IsEmail, IsNotEmpty } from 'class-validator';

export default class CreateUserDto {
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;
}
