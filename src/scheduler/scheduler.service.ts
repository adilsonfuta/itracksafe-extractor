import { Injectable } from "@nestjs/common";
import { ExportService } from "src/export/export.service";
import { Cron } from '@nestjs/schedule';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SchedulerService {

    private cronStart;

    constructor( private readonly exportservice: ExportService, private readonly configservice: ConfigService
    ){
            this.cronStart = this.configservice.get('ITRACKSAFE_CRON')!;
    }

    // carregar os devices de um arquivos ou arrays de devices
    private devices = ["6038131591","6038131650","6038132052","6038078555","6038052969"];
    
   // @Cron('0 1 * * *')
   @Cron('*/5 * * * *')
    async handleDailyExport(){
        console.log('Daily extraction started ... ');
        await this.exportservice.exportDaily(this.devices);
        console.log('Daily extraction finished ... ');
    }

}

    

