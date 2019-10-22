
import { Module, forwardRef } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'

import { UsersModule } from '../users/users.module'
import { ConfigModule } from '../config/config.module'
import { AuthService } from './auth.service'
import { LocalStrategy } from './local.strategy'
import { JwtStrategy } from './jwt.strategy'
import { ConfigService } from '../config/config.service'
import { AuthController } from './auth.controller'

const jwtModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    secret: configService.jwtSecret,
    signOptions: {
      expiresIn: configService.jwtSecret,
    },
  }),
  inject: [ConfigService],
}

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    forwardRef(() => UsersModule),
    ConfigModule,
    JwtModule.registerAsync(jwtModuleAsyncOptions),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule { }
