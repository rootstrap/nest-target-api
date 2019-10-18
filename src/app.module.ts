import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  controllers: [AppController],
  imports: [
    TypeOrmModule.forRoot(),
    AuthModule,
    UsersModule
  ]
})
export class AppModule { }
