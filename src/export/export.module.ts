import { Module } from '@nestjs/common';
import { ExportController } from './export.controller';

@Module({
  imports:[],
  exports:[],
  providers:[],
  controllers: [ExportController]
})
export class ExportModule {}
