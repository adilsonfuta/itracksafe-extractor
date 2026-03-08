import { Injectable } from '@nestjs/common';
import { ItracksafeService } from 'src/itracksafe/itracksafe.service';
import {createObjectCsvWriter } from 'csv-writer';
import pLimit from 'p-limit';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ExportService {

    constructor(private readonly itrack: ItracksafeService){

    }

    async exportDaily(devices: string[]){
        const date = new Date().toISOString().slice(0,10);
        const folder = path.join('date', date);
        const limit = pLimit(20)
        const start = `${date} 00:00:00`;
        const end = `${date} 23:59:59`;

        // definir o melhor caminho para pasta e usar o drive ou sincronizar
        if(!fs.existsSync(folder)){
            fs.mkdirSync(folder,{recursive:true})
        }

        await Promise.all(
            devices.map(
                deviceId => limit(()=>this.processDevice(deviceId,start,end,folder))
            )
        )


    }

    private async processDevice(deviceId: string,start: string,end: string,folder: string){
        const tracks = await this.itrack.queryTracks(deviceId,start,end);
        
        if(!tracks.length) return;
        const csvWriter = createObjectCsvWriter({
            path: `${folder}/${deviceId}.csv`, 
            header: [
                {id:'updateTime', title: 'updateTime'},
                {id:'latitude', title: 'latitude'},
                {id:'longitude', title: 'longitude'},
                {id:'speed', title: 'speed'},
                {id:'direction', title: 'direction'},
                {id:'address', title: 'address'},
            ]
        }) 

        await csvWriter.writeRecords(tracks);
    }

}
