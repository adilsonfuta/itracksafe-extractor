import { Module } from '@nestjs/common';
import { DeviceService } from '../device.service';

@Module({
    imports:[],
    controllers:[],
    providers:[DeviceService],
    exports:[DeviceService]
})
export class HelperModule {}
