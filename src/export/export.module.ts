import { Module } from '@nestjs/common';
import { ExportController } from './export.controller';

//iepc
@Module({
  imports:[],
  exports:[],
  providers:[],
  controllers: [ExportController]
})
export class ExportModule {}
