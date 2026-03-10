import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class ItracksafeService {
  private token;
  private baseUrl = 'https://itracksafe.com/webapi';

  constructor(private readonly configservice: ConfigService) {
    this.token = configservice.get('ITRACKSAFE_TOKEN');
  }

  async queryTracks(deviceId: string, start: string, end: string) {
    const url = `${this.baseUrl}?action=querytracks&token=${this.token}`;

    const { data } = await axios.post(url, {
      deviceid: deviceId,
      starttime: start,
      endtime: end,
      timezone: 1, // UTC+1
    });

    console.log(
      JSON.stringify(data, null, 2) + ' \n ** GPS DATA DEVICES: ** \n',
    );

    const tracks = Array.isArray(data?.records) ? data.records : [];

    if (!tracks.length) {
      console.log(`Nenhum track para device ${deviceId}`);
      return [];
    }

    console.log(`Encontrados ${tracks.length} registros`);

    return tracks.map((item) => ({
      deviceid: deviceId,
      datetime: item.updatetime,
      latitude: item.callat,
      longitude: item.callon,
      speed_kmh: item.speed / 10, // converter km/h
      course_deg: item.course,

      status: item.strstatusen,
      distance_m: '',
      altitude_m: '',
      positioning: item.gotsrc,
      alarm: item.stralarmen ?? '',
      track_points: '',
      startime: item.starttime,
      endtime: item.endtime,
      
    }));
  }
}
