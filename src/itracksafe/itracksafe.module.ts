import { Module } from '@nestjs/common';
import { ItracksafeService } from './itracksafe.service';
import { ItracksafeController } from './itracksafe.controller';

@Module({
  imports:[],
  controllers: [ItracksafeController],
  providers: [ItracksafeService],
  exports:[ItracksafeService],
})
export class ItracksafeModule {}
