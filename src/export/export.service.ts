import { Injectable, Logger } from '@nestjs/common';
import { ItracksafeService } from 'src/itracksafe/itracksafe.service';
import { createObjectCsvWriter } from 'csv-writer';
import pLimit from 'p-limit';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ExportService {
  private readonly logger = new Logger(ExportService.name);

  constructor(
    private readonly itrack: ItracksafeService,
    private readonly configservice: ConfigService,
  ) {}

  // =====================================================
  // EXPORT DIÁRIO (usado pelo CRON)
  // =====================================================
  async exportDaily(devices: string[]) {
    const today = new Date();
    await this.exportByDateRange(devices, today, today);
  }

  // =====================================================
  // EXPORT POR INTERVALO (DIVIDIDO DIA A DIA)
  // =====================================================
  async exportByDateRange(
    devices: string[],
    dateStart: Date,
    dateEnd: Date,
  ) {
    const concurrency =
      Number(this.configservice.get('ITRACKSAFE_CONCURRENCY')) ?? 8;

    const limit = pLimit(concurrency);

    for (const day of this.eachDay(dateStart, dateEnd)) {
      const dateStr = this.formatFolderDate(day);

      const start = `${dateStr} 00:00:00`;
      const end = `${dateStr} 23:59:59`;

      const folder = path.join('exports', dateStr);

      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
      }

      this.logger.log(`===== EXPORTING DAY ${dateStr} =====`);

      await Promise.all(
        devices.map((deviceId) =>
          limit(() =>
            this.processDevice(deviceId, start, end, folder),
          ),
        ),
      );
    }

    this.logger.log('Export finished');
  }

  // =====================================================
  // ITERADOR DE DIAS (MEMÓRIA CONSTANTE)
  // =====================================================
  private *eachDay(start: Date, end: Date) {
    const current = new Date(start);

    while (current <= end) {
      yield new Date(current);
      current.setDate(current.getDate() + 1);
    }
  }

  // =====================================================
  // FORMATADORES
  // =====================================================
  private formatDate(date: Date, time: string): string {
    const d = date.toISOString().slice(0, 10);
    return `${d} ${time}`;
  }

  private formatFolderDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  // =====================================================
  // RETRY COM EXPONENTIAL BACKOFF
  // =====================================================
  private async retryWithBackoff(
    fn: () => Promise<any>,
    retries?: number,
    delay?: number,
  ): Promise<any> {
    const maxRetries =
      retries ??
      Number(this.configservice.get('ITRACKSAFE_RETRIES') ?? 6);

    const baseDelay =
      delay ??
      Number(this.configservice.get('ITRACKSAFE_DELAY') ?? 3000);

    try {
      return await fn();
    } catch (error) {
      if (maxRetries <= 0) {
        throw error;
      }

      this.logger.warn(`Retry in ${baseDelay}ms...`);

      await new Promise((res) => setTimeout(res, baseDelay));

      return this.retryWithBackoff(fn, maxRetries - 1, baseDelay * 2);
    }
  }

  // =====================================================
  // PROCESSAR DEVICE (1 DIA APENAS)
  // =====================================================
  private async processDevice(
    deviceId: string,
    start: string,
    end: string,
    folder: string,
  ) {
    this.logger.debug(`Processing device ${deviceId}`);

    try {
      const tracks = await this.retryWithBackoff(() =>
        this.itrack.queryTracks(deviceId, start, end),
      );

      if (!tracks || tracks.length === 0) {
        this.logger.warn(`No tracks for device ${deviceId}`);
        return;
      }

      this.logger.log(
        `Exporting ${tracks.length} tracks → ${deviceId}`,
      );

      const filePath = path.join(folder, `${deviceId}.csv`);

      const csvWriter = createObjectCsvWriter({
        path: filePath,
        header: [
          { id: 'deviceid', title: 'deviceid' },
          { id: 'datetime', title: 'datetime' },
          { id: 'latitude', title: 'latitude' },
          { id: 'longitude', title: 'longitude' },
          { id: 'speed_kmh', title: 'speed_kmh' },
          { id: 'course_deg', title: 'course_deg' },
          { id: 'status', title: 'status' },
          { id: 'distance_m', title: 'distance_m' },
          { id: 'altitude_m', title: 'altitude_m' },
          { id: 'positioning', title: 'positioning' },
          { id: 'alarm', title: 'alarm' },
          { id: 'track_points', title: 'track_points' },
          { id: 'start_time', title: 'start_time' },
          { id: 'end_time', title: 'end_time' },
        ],
      });

      await csvWriter.writeRecords(tracks);
    } catch (error) {
      this.logger.error(
        `Error processing device ${deviceId}`,
        error?.stack || error?.message,
      );
    }
  }
}