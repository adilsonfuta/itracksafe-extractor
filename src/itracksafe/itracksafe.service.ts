import { Injectable, Logger} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class ItracksafeService {
  private token;
  private baseUrl;
  private logger; //  = new Logger(ItracksafeService.name);

  constructor(private readonly configservice: ConfigService) {
    this.token = configservice.get('ITRACKSAFE_TOKEN');
    this.baseUrl = configservice.get('ITRACKSAFE_BASE_URL');
    this.logger = new Logger(ItracksafeService.name);
  }

  async queryTracks(deviceId: string, start: string, end: string) {
    const url = `${this.baseUrl}?action=querytracks&token=${this.token}`;

    const { data } = await axios.post(url, {
      deviceid: deviceId,
      starttime: start,
      endtime: end,
      timezone: 1,
    });

    // this.logger.log(`\n \n ${JSON.stringify(data, null, 2)}  `);

    const tracks = Array.isArray(data?.records) ? data.records : [];

    if (!tracks.length) {
      this.logger.warn(`Nenhum track para device ${deviceId}`);
      return [];
    }

     this.logger.warn(`Encontrados ${tracks.length} registros`);


return tracks.map((item) => {

  const speed = item.speed / 10;

  return {
    deviceid: deviceId,

    datetime: new Date(item.updatetime).toISOString(),

    latitude: item.callat,
    longitude: item.callon,

    speed_kmh: speed > 300 ? 0 : speed,
    course_deg: item.course,

    status: item.strstatusen,

    distance_m: item.totaldistance,
    altitude_m: item.altitude,

    positioning: item.gotsrc,

    alarm: item.stralarmen ?? '',

    track_points: item.trackCount,

    start_time: new Date(item.starttime).toISOString(),
    end_time: new Date(item.endtime).toISOString(),
  };
});

  
}
}
