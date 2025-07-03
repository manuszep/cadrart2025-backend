import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, unknown>): Promise<string> {
    // Use IP address as the default tracker
    const ips = req.ips as string[];
    const ip = ips?.length ? ips[0] : (req.ip as string);
    return Promise.resolve(ip || 'unknown');
  }
}
