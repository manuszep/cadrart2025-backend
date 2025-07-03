import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import { wsCorsConfig } from '../utils/cors.config';

import { CadrartSocketService } from './socket.service';

@WebSocketGateway(8001, {
  cors: wsCorsConfig,
  path: '/ws'
})
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
    this.logger.log(`Client connected: ${client.id}`);
  }
}
