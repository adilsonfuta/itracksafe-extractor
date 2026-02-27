import { Module } from '@nestjs/common';
import { ItracksafeService } from './itracksafe.service';
import { ItracksafeController } from './itracksafe.controller';

@Module({
  controllers: [ItracksafeController],
  providers: [ItracksafeService],
})
export class ItracksafeModule {}
