import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { ExportModule } from 'src/export/export.module';
import { HelperModule } from 'src/helper/helper.module';

@Module({
  imports:[ExportModule, HelperModule],
  providers: [SchedulerService],
  controllers:[],
  exports:[]
})
export class SchedulerModule {}
