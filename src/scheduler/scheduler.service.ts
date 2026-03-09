import { Injectable } from "@nestjs/common";
import { ExportService } from "src/export/export.service";
import { Cron } from '@nestjs/schedule';
import { ConfigService } from "@nestjs/config";
import { Device } from "./interface/device.interface";
import path from "path";
import * as fs from 'fs';

@Injectable()
export class SchedulerService{

    private cronStart;

    constructor( private readonly exportservice: ExportService, private readonly configservice: ConfigService
    ){
            this.cronStart = this.configservice.get('ITRACKSAFE_CRON')!;
    }

  
    private devices = ["6038131591","6038131650","6038132052","6038078555","6038052969"];

      // carregar os devices de um arquivos ou arrays de devices
      private loadDevices():Device[]{
        const filePath = path.join(process.cwd(),'src','devices','devices.json');
        const raw = fs.readFileSync(filePath,'utf-8');
        return JSON.parse(raw);
      }
    
   
// @Cron('*/5 * * * *')
  @Cron('0 /59 * * *')
    async handleDailyExport(){

        const allDevices = this.loadDevices();
        const deviceIds = allDevices.map(d => d.deviceid);
        console.log('Extraction started ... ');

       // await this.exportservice.exportDaily(this.devices);
        await this.exportservice.exportByDateRange(deviceIds,
            new Date('2026-03-01'),
            new Date('2026-03-07'))

        console.log('Extraction finished ... ');
    }

}

    

