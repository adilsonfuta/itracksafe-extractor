import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItracksafeModule } from './itracksafe/itracksafe.module';
import { DatabaseModule } from './database/database.module';
import { SchedulerModule } from './scheduler/scheduler.module';

@Module({
  imports: [ItracksafeModule, DatabaseModule, SchedulerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
