import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItracksafeModule } from './itracksafe/itracksafe.module';
import { DatabaseModule } from './database/database.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { ExportService } from './export/export.service';
import { ExportModule } from './export/export.module';

@Module({
  imports: [ItracksafeModule, DatabaseModule, SchedulerModule, ExportModule],
  controllers: [AppController],
  providers: [AppService, ExportService],
})
export class AppModule {}
