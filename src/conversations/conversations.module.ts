import { Module } from '@nestjs/common'

import { ConversationsGateway } from './conversations.gateway'
import { AuthModule } from 'auth/auth.module'

@Module({
  imports: [AuthModule],
  providers: [ConversationsGateway],
})
export class ConversationsModule {}
