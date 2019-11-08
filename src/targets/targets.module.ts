import { Module } from '@nestjs/common'
import { TargetsController } from './targets.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PassportModule } from '@nestjs/passport'

import { AuthModule } from 'auth/auth.module'
import { TargetsService } from 'targets/targets.service'
import { Target } from 'targets/target.entity'
import { TopicsModule } from 'topics/topics.module'
import { Topic } from 'topics/topic.entity'
import { UsersModule } from 'users/users.module'
import { User } from 'users/user.entity'

@Module({
  imports: [
    TopicsModule,
    AuthModule,
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([Target, User, Topic]),
  ],
  controllers: [TargetsController],
  providers: [TargetsService],
  exports: [TargetsService],
})
export class TargetsModule {}
