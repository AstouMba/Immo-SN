import { Controller, Get } from '@nestjs/common';
import { Public } from '../common/public.decorator.js';

@Controller()
export class RootController {
  @Public()
  @Get()
  getRoot() {
    return {
      status: 'ok',
      service: 'diaspora-imo-mathiam-mbow-api',
      basePath: '/api',
      health: '/api/health',
    };
  }
}
