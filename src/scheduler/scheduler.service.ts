import { Injectable, Logger } from "@nestjs/common";
import { ExportService } from "src/export/export.service";
import { Cron } from '@nestjs/schedule';
import { ConfigService } from "@nestjs/config";
import { Device } from "./interface/device.interface";
import path from "path";
import * as fs from 'fs';
import { DeviceService } from "src/helper/device.service";

@Injectable()
export class SchedulerService {



    private itrackDateSart;
    private itrackDateEnd;
    private logger = new Logger(SchedulerService.name)

    constructor(private readonly exportservice: ExportService, 
        private readonly configservice: ConfigService,
        private readonly deviceservice: DeviceService
    ) {
        this.itrackDateSart = this.configservice.get('ITRACKSAFE_DATE_START');
        this.itrackDateEnd = this.configservice.get('ITRACKSAFE_DATE_END');
    }


    @Cron('*/58 * * * *')
    async handleDailyExport() {
        try {
            const allDevices = this.deviceservice.getAll();
            const deviceIds = allDevices.map(d => d.deviceid);
            this.logger.log('\n Extraction Started \n');
            await this.exportservice.exportByDateRange(deviceIds, new Date(this.itrackDateSart), new Date(this.itrackDateEnd));
            this.logger.log('\n Extraction finished \n');

        } catch (error) {
            this.logger.error(`\n Export Failed: ${error.stack} \n`);
        }

    }

}



/*  
//private devices = ["6038131591","6038131650","6038132052","6038078555","6038052969"];
    private loadDevices():Device[]{
        const filePath = path.join(process.cwd(),'src','devices','devices.json');
        const raw = fs.readFileSync(filePath,'utf-8');
        return JSON.parse(raw);
      }
*/ 