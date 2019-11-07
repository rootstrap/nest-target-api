import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import entities from 'entities'
import { AuthModule } from 'auth/auth.module'
import { ConversationsModule } from 'conversations/conversations.module'
import { UsersModule } from 'users/users.module'
import { ConfigModule } from 'config/config.module'
import { ConfigService } from 'config/config.service'
import { TopicsModule } from 'topics/topics.module'
import { TargetsModule } from 'targets/targets.module'
import { SchedulerModule } from 'scheduler/scheduler.module'

const ormAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    ...configService.ormConfig,
    entities,
  }),
  inject: [ConfigService],
}

@Module({
  imports: [
    TypeOrmModule.forRootAsync(ormAsyncOptions),
    ConversationsModule,
    SchedulerModule,
    AuthModule,
    UsersModule,
    TopicsModule,
    TargetsModule,
  ],
})
export class AppModule {}
