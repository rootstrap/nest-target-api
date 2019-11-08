import { Injectable } from '@nestjs/common'

import { AuthService } from 'auth/auth.service'

import {
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
} from '@nestjs/websockets'

@Injectable()
@WebSocketGateway()
export class ConversationsGateway implements OnGatewayConnection {
  constructor(private readonly authService: AuthService) {}
  @WebSocketServer() server

  async handleConnection(socket) {
    try {
      await this.authService.validateJWT(socket.handshake.headers.token)
    } catch (err) {
      socket.disconnect(true)
    }
  }
}
