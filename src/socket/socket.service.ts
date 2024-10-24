import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class CadrartSocketService {
  public socket: Server | null = null;
}
