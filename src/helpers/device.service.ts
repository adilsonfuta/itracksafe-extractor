import { Device } from "src/scheduler/interface/device.interface";
import path from "path";
import * as fs from 'fs';
import { Injectable } from "@nestjs/common";

@Injectable()
export class DeviceService{

    private devices: Device[];

    constructor(){
            this.devices = this.loadDevices();
    }

          private loadDevices():Device[]{
            const filePath = path.join(process.cwd(),'src','devices','devices.json');
            const raw = fs.readFileSync(filePath,'utf-8');
            return JSON.parse(raw);
          }

    getAll(){
        return this.devices;
    }

}