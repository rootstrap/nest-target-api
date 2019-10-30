import { Module } from '@nestjs/common'
import { TargetsController } from './targets.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PassportModule } from '@nestjs/passport'

import { AuthModule } from '../auth/auth.module'
import { UsersModule } from '../users/users.module'
import { TopicsModule } from '../topics/topics.module'
import { TargetsService } from './targets.service'
import { Target } from './target.entity'
import { Topic } from '../topics/topic.entity'
import { User } from '../users/user.entity'

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
