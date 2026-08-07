import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './database/prisma.module.js';
import { JwtAuthGuard, RolesGuard } from './common/guards.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { PropertiesModule } from './modules/properties/properties.module.js';
import { InquiriesModule } from './modules/inquiries/inquiries.module.js';
import { VisitsModule } from './modules/visits/visits.module.js';
import { ReservationsModule } from './modules/reservations/reservations.module.js';
import { HealthController } from './modules/health.controller.js';
import { RootController } from './modules/root.controller.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    PropertiesModule,
    InquiriesModule,
    VisitsModule,
    ReservationsModule,
  ],
  controllers: [HealthController, RootController],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
