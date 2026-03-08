import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { ExportModule } from 'src/export/export.module';

@Module({
  imports:[ExportModule],
  providers: [SchedulerService],
  controllers:[],
  exports:[]
})
export class SchedulerModule {}
