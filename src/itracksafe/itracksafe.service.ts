import { Injectable, Logger} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

interface RawTrackRecord {
  updatetime: string | number;
  callat: number;
  callon: number;
  speed: number;
  course: number;
  strstatusen: string;
  totaldistance: number;
  altitude: number;
  gotsrc: string;
  stralarmen?: string;
  trackCount: number;
  starttime: string | number;
  endtime: string | number;
}

@Injectable()
export class ItracksafeService {
  private static readonly EARTH_RADIUS_M = 6371000;
  private static readonly DEFAULT_MIN_DISTANCE_METERS = 30;
  private static readonly DEFAULT_MAX_TIME_GAP_MS = 5 * 60 * 1000;

  private token;
  private baseUrl;
  private minDistanceMeters;
  private maxTimeGapMs;
  private logger; //  = new Logger(ItracksafeService.name);

  constructor(private readonly configservice: ConfigService) {
    this.token = configservice.get('ITRACKSAFE_TOKEN');
    this.baseUrl = configservice.get('ITRACKSAFE_BASE_URL');
    this.minDistanceMeters = Number(
      configservice.get('ITRACKSAFE_MIN_DISTANCE_METERS') ??
        ItracksafeService.DEFAULT_MIN_DISTANCE_METERS,
    );
    this.maxTimeGapMs = Number(
      configservice.get('ITRACKSAFE_MAX_TIME_GAP_MS') ??
        ItracksafeService.DEFAULT_MAX_TIME_GAP_MS,
    );
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

    const filteredTracks = this.filterRedundantTracks(tracks);

    this.logger.warn(
      `Encontrados ${tracks.length} registros, ${filteredTracks.length} apos filtro`,
    );


return filteredTracks.map((item) => {

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

  private filterRedundantTracks(tracks: RawTrackRecord[]): RawTrackRecord[] {
    let lastSaved: RawTrackRecord | null = null;

    return tracks.filter((track) => {
      if (!lastSaved || this.shouldSave(track, lastSaved)) {
        lastSaved = track;
        return true;
      }

      return false;
    });
  }

  private shouldSave(
    newPoint: RawTrackRecord,
    lastPoint: RawTrackRecord,
  ): boolean {
    const moved =
      this.distanceMeters(newPoint, lastPoint) > this.minDistanceMeters;

    const statusChanged = newPoint.strstatusen !== lastPoint.strstatusen;

    const timeGap =
      this.parseTimestamp(newPoint.updatetime) -
        this.parseTimestamp(lastPoint.updatetime) >
      this.maxTimeGapMs;

    return moved || statusChanged || timeGap;
  }

  private distanceMeters(
    a: Pick<RawTrackRecord, 'callat' | 'callon'>,
    b: Pick<RawTrackRecord, 'callat' | 'callon'>,
  ): number {
    const dLat = this.toRadians(b.callat - a.callat);
    const dLon = this.toRadians(b.callon - a.callon);

    const haversine =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(this.toRadians(a.callat)) *
        Math.cos(this.toRadians(b.callat)) *
        Math.sin(dLon / 2) ** 2;

    return (
      2 *
      ItracksafeService.EARTH_RADIUS_M *
      Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
    );
  }

  private toRadians(value: number): number {
    return (value * Math.PI) / 180;
  }

  private parseTimestamp(value: string | number): number {
    const parsed = new Date(value).getTime();
    return Number.isFinite(parsed) ? parsed : 0;
  }
}
