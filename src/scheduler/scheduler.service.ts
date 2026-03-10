import { Injectable } from "@nestjs/common";
import { ExportService } from "src/export/export.service";
import { Cron } from '@nestjs/schedule';
import { ConfigService } from "@nestjs/config";
import { Device } from "./interface/device.interface";
import path from "path";
import * as fs from 'fs';

@Injectable()
export class SchedulerService{

    //private devices = ["6038131591","6038131650","6038132052","6038078555","6038052969"];

    private itrackDateSart;
    private itrackDateEnd;

    constructor(
         private readonly exportservice: ExportService, 
        private readonly configservice: ConfigService ){
            this.itrackDateSart = this.configservice.get('ITRACKSAFE_DATE_START');
             this.itrackDateEnd = this.configservice.get('ITRACKSAFE_DATE_END');
         }

      // carregar os devices de um arquivos ou arrays de devices
      private loadDevices():Device[]{
        const filePath = path.join(process.cwd(),'src','devices','devices.json');
        const raw = fs.readFileSync(filePath,'utf-8');
        return JSON.parse(raw);
      }
    
   
    @Cron('*/15 * * * *')
    async handleDailyExport(){

        const allDevices = this.loadDevices();
        const deviceIds = allDevices.map(d => d.deviceid);
        console.log('\n INICIALIZANDO A EXTRACAO ... \n');
        await this.exportservice.exportByDateRange(deviceIds, new Date(this.itrackDateSart), new Date(this.itrackDateEnd));
        console.log('\n FINALIZANDO A EXTRACAO \n');
    }

}

    

