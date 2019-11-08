import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PassportModule } from '@nestjs/passport'

import { AuthModule } from 'auth/auth.module'
import { Topic } from 'topics/topic.entity'
import { TopicsController } from 'topics/topics.controller'
import { TopicsService } from 'topics/topics.service'

@Module({
  imports: [
    AuthModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([Topic]),
  ],
  controllers: [TopicsController],
  providers: [TopicsService],
  exports: [TopicsService],
})
export class TopicsModule {}
