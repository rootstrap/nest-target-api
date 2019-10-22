import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { ConfigModule } from './config/config.module'
import { ConfigService } from './config/config.service'

const ormAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) =>  configService.ormConfig,
  inject: [ConfigService],
}

@Module({
  controllers: [AppController],
  imports: [
    TypeOrmModule.forRootAsync(ormAsyncOptions),
    AuthModule,
    UsersModule,
  ],
})
export class AppModule { }
