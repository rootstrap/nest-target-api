import { Module, forwardRef } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ConfigModule } from '../config/config.module'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { AuthModule } from '../auth/auth.module'
import { User } from './user.entity'

@Module({
  imports: [
    forwardRef(() => AuthModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([User]),
    ConfigModule,
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
