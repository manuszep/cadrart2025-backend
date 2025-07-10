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
import { MonitoringService } from '../services/monitoring.service';

import { CadrartSocketService } from './socket.service';
import { WsAuthGuard } from './ws-auth.guard';

@WebSocketGateway(8001, {
  cors: wsCorsConfig,
  path: '/ws'
})
@UseGuards(WsAuthGuard)
export class CadrartAppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private socketService: CadrartSocketService,
    private monitoringService: MonitoringService
  ) {}

  @WebSocketServer() public server!: Server;

  private logger: Logger = new Logger('AppGateway');

  afterInit(server: Server): void {
    this.socketService.socket = server;
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.monitoringService.recordWebSocketEvent('disconnection');
  }

  handleConnection(client: Socket): void {
    const user = client.data.user;
    this.logger.log(`Client connected: ${client.id} - User: ${user?.username || 'Unknown'}`);
    this.monitoringService.recordWebSocketEvent('connection');
  }

  @SubscribeMessage('ping')
  handlePing(client: Socket): void {
    const user = client.data.user;
    this.logger.log(`Ping from ${client.id} - User: ${user?.username}`);

    this.monitoringService.recordWebSocketEvent('messageReceived');
    client.emit('pong', { message: 'pong', timestamp: new Date().toISOString() });
    this.monitoringService.recordWebSocketEvent('messageSent');
  }
}
