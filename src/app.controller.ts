import { Controller, Get } from '@nestjs/common';

@Controller()
export class CadrartAppController {
  @Get()
  getHello(): string {
    return 'hello';
  }
}
