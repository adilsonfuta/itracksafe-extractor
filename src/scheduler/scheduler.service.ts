import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ExportService } from "src/export/export.service";
import { Cron } from '@nestjs/schedule';
import { ConfigService } from "@nestjs/config";
import { Device } from "./interface/device.interface";
import path from "path";
import * as fs from 'fs';
import { DeviceService } from "src/helper/device.service";

@Injectable()
export class SchedulerService implements OnModuleInit{



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

    onModuleInit() {
        this.handleDailyExport();
    }


    private isRunning = false; // Trava de segurança

    @Cron('0 */6 * * *') // A cada 6 horas
    async handleDailyExport() {
        if (this.isRunning) {
            this.logger.warn('Extração ignorada: a anterior ainda está em execução.');
            return;
        }

        this.isRunning = true; // Bloqueia novas execuções
        try {
            const allDevices = this.deviceservice.getAll();
            const deviceIds = allDevices.map(d => d.deviceid);

            this.logger.log('--- Iniciando Extração ---');
            await this.exportservice.exportByDateRange(deviceIds, new Date(this.itrackDateSart), new Date(this.itrackDateEnd));
            this.logger.log('--- Extração Finalizada ---');
        } catch (error) {
            this.logger.error(`Falha no Export: ${error.message}`);
        } finally {
            this.isRunning = false; // Libera para o próximo ciclo (daqui a 15min)
        }
    }

}
