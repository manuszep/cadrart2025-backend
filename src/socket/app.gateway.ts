import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import { CadrartSocketService } from './socket.service';

@WebSocketGateway(8001, {
  cors: {
    origin:
      process.env.NODE_ENV === 'production'
        ? ['https://ateliercadrart.com', 'https://www.ateliercadrart.com']
        : ['http://localhost:4200', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST']
  },
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
