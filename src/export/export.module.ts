import { Module } from '@nestjs/common';
import { ExportController } from './export.controller';
import { ItracksafeModule } from 'src/itracksafe/itracksafe.module';
import { ExportService } from './export.service';

@Module({
  imports:[ItracksafeModule],
  exports:[ExportService],
  providers:[ExportService],
  controllers: [ExportController]
})
export class ExportModule {}
