import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient();
      const token = this.extractTokenFromHandshake(client);

      if (!token) {
        throw new WsException('Unauthorized access');
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.config.get('CADRART_JWT_SECRET')
      });

      // Attach user data to socket for later use
      client.data.user = payload;

      return true;
    } catch {
      throw new WsException('Unauthorized access');
    }
  }

  private extractTokenFromHandshake(client: Socket): string | undefined {
    const auth = client.handshake.auth;

    // Check for token in auth object
    if (auth?.token) {
      return auth.token;
    }

    // Check for token in query parameters
    const query = client.handshake.query;
    if (query?.token && typeof query.token === 'string') {
      return query.token;
    }

    // Check for Authorization header
    const headers = client.handshake.headers;
    const authHeader = headers.authorization;
    if (authHeader) {
      const [type, token] = authHeader.split(' ');
      return type === 'Bearer' ? token : undefined;
    }

    return undefined;
  }
}
