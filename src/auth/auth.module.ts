import { Module, forwardRef } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'

import { AuthService } from 'auth/auth.service'
import { JwtStrategy } from 'auth/jwt.strategy'
import { LocalStrategy } from 'auth/local.strategy'
import { AuthController } from 'auth/auth.controller'
import { ConfigModule } from 'config/config.module'
import { ConfigService } from 'config/config.service'
import { UsersModule } from 'users/users.module'

const jwtModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    secret: configService.jwtSecret,
    signOptions: {
      expiresIn: configService.jwtExpiry,
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
export class AuthModule {}
