import { Injectable } from '@nestjs/common';
import { CreateItracksafeDto } from './dto/create-itracksafe.dto';
import { UpdateItracksafeDto } from './dto/update-itracksafe.dto';
import { ConfigService} from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class ItracksafeService {

     private token;
      private baseUrl = 'https://itracksafe.com/webapi';

      constructor(private readonly configservice: ConfigService){
            this.token = configservice.get('ITRACKSAFE_TOKEN');
      }

    async queryTracks(deviceId: string, start: string, end: string){
      //querytracks
      const url = `${this.baseUrl}?action=querytracks&token=${this.token}`;

      const { data } = await axios.post(url,{
        deviceid: deviceId,
        starttime: start,
        endtime: end,
        timezone: 8,
      })

      return data.record || data.data || [];

    }




}
