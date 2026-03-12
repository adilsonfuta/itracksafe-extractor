import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItracksafeModule } from './itracksafe/itracksafe.module';
import { DatabaseModule } from './database/database.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { ExportService } from './export/export.service';
import { ExportModule } from './export/export.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerConfig } from './helper/logger.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    ItracksafeModule,
    SchedulerModule,
    ExportModule,
  LoggerConfig],
  controllers: [AppController],
  providers: [AppService, ExportService],
  exports:[]
})
export class AppModule { }
