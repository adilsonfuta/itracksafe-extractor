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
    private devices = ["1001","1002"];

    
    
   // @Cron('0 1 * * *')
   @Cron('*/5 * * * *')
    async handleDailyExport(){
        console.log('Daily extraction started ... ');
            await this.exportservice.exportDaily(this.devices);
        console.log('Daily extraction started ... ');
    }

}

    

