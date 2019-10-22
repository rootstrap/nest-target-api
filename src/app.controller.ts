import { Controller, Get, Request, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from './auth/auth.service'

@Controller()
export class AppController { }
