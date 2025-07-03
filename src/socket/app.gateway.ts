import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import { wsCorsConfig } from '../utils/cors.config';

import { CadrartSocketService } from './socket.service';
import { WsAuthGuard } from './ws-auth.guard';

@WebSocketGateway(8001, {
  cors: wsCorsConfig,
  path: '/ws'
})
@UseGuards(WsAuthGuard)
export class CadrartAppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private socketService: CadrartSocketService) {}

  @WebSocketServer() public server!: Server;

  private logger: Logger = new Logger('AppGateway');

  afterInit(server: Server): void {
    this.socketService.socket = server;
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket): void {
    const user = client.data.user;
    this.logger.log(`Client connected: ${client.id} - User: ${user?.username || 'Unknown'}`);
  }

  @SubscribeMessage('ping')
  handlePing(client: Socket): void {
    const user = client.data.user;
    this.logger.log(`Ping from ${client.id} - User: ${user?.username}`);
    client.emit('pong', { message: 'pong', timestamp: new Date().toISOString() });
  }
}
