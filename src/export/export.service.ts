import { Injectable } from '@nestjs/common';
import { ItracksafeService } from 'src/itracksafe/itracksafe.service';
import { createObjectCsvWriter } from 'csv-writer';
import pLimit from 'p-limit';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ExportService {

    constructor(private readonly itrack: ItracksafeService, private readonly configservice: ConfigService
    ) { }

    // exportar os dados diariamente para csv, definir o caminho e o nome do arquivo 
    async exportDaily(devices: string[]) {
        const date = new Date().toISOString().slice(0, 10);
        const folder = path.join('date', date);
        const limit = pLimit(8)
        const start = `${date} 00:00:00`;
        const end = `${date} 23:59:59`;

        // definir o melhor caminho para pasta e usar o drive ou sincronizar
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true })
        }

        await Promise.all(
            devices.map(
                deviceId => limit(() => this.processDevice(deviceId, start, end, folder))
            )
        )
    }

    private formatDate(date: Date, time: string): string {
        const d = date.toISOString().slice(0,10);
        return `${d} ${time}`;
    }

    private formateFolderDate(date:Date): string{
        return date.toISOString().slice(0,10);
    }

    async exportByDateRange(devices: string[], dateStart, dateEnd){
        const start = this.formatDate(dateStart,'00:00:00');
        const end = this.formatDate(dateEnd,'23:59:59');
        
        console.log('\n Query interval \n ',start,end);
        
        const folderName  = `${this.formateFolderDate(dateStart)}_${this.formateFolderDate(dateEnd)}`;
        const folder = path.join('exports',folderName);

        const limit = pLimit(8);

        if(!fs.existsSync(folder)){
            fs.mkdirSync(folder,{recursive: true});
        }

        await Promise.all(
            devices.map( 
                deviceId => limit(() => this.processDevice(deviceId,start,end,folder),
                ),
            ),
        );
    }

    private async retrywithBackoff(
        fn: () => Promise<any>,
        retries = this.configservice.get('ITRACKSAFE_RETRIES') | 6,
        delay = this.configservice.get('ITRACKSAFE_DELAY') | 3000) {

        try {
            return await fn();
        } catch (error) {
            if (retries === 0) {
                throw error;
            }
            console.log(`retry in ${delay}ms...`);
            await new Promise(res => setTimeout(res, delay));
            return this.retrywithBackoff(fn,retries-1, delay*2);
            
        }
    }

    private async processDevice(deviceId: string, start: string, end: string, folder: string) {

        try {
            // colocar aqui a retry caso api falhar deve ter uma retentativa ...
           // const tracks = await this.itrack.queryTracks(deviceId, start, end);

           const tracks = await this.retrywithBackoff(
            ()=> this.itrack.queryTracks(deviceId,start,end)
            );

            console.log(tracks);
            

            if (!tracks || tracks.length === 0) {
                console.log(`\n Nenhum track para device: ${deviceId}\n`);
                return;
            }

            const csvWriter = createObjectCsvWriter({
                path: `${folder}/${deviceId}.csv`,
                header: [
                    { id: 'updateTime', title: 'updateTime' },
                    { id: 'latitude', title: 'latitude' },
                    { id: 'longitude', title: 'longitude' },
                    { id: 'speed', title: 'speed' },
                    { id: 'direction', title: 'direction' },
                    { id: 'address', title: 'address' },
                ]
            })

            await csvWriter.writeRecords(tracks);

        } catch (error) {
            console.error(`Erro no device ${deviceId}`, error.message);
        }
    }

}
