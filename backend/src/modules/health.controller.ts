import { Controller, Get } from '@nestjs/common';
import { Public } from '../common/public.decorator.js';

@Controller('health')
export class HealthController {
  @Public()
  @Get()
  check() {
    return { status: 'ok', service: 'diaspora-imo-mathiam-mbow-api' };
  }
}
