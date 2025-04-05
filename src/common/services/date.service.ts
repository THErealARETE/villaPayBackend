import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';

@Injectable()
export class DateService {
  nowUtc() {
    return DateTime.utc();
  }

  nowLocal(zone = 'Africa/Lagos'): DateTime {
    return DateTime.now().setZone(zone);
  }

  fromISO(iso: string, zone = 'utc'): DateTime {
    return DateTime.fromISO(iso, { zone });
  }

  fromJSDate(date: Date, zone = 'utc'): DateTime {
    return DateTime.fromJSDate(date, { zone });
  }

  toJSDate(dt: DateTime): Date {
    return dt.toJSDate();
  }

  formatISO(dt: DateTime) {
    return dt.toISO(); // ISO string
  }

  diffInMinutes(a: DateTime, b: DateTime): number {
    return a.diff(b, 'minutes').minutes;
  }

  addMinutes(dt: DateTime, mins: number): DateTime {
    return dt.plus({ minutes: mins });
  }

  subtractDays(dt: DateTime, days: number): DateTime {
    return dt.minus({ days });
  }

  isBefore(a: DateTime, b: DateTime): boolean {
    return a < b;
  }

  isAfter(a: DateTime, b: DateTime): boolean {
    return a > b;
  }

  format(dt: DateTime, format = 'yyyy-MM-dd HH:mm'): string {
    return dt.toFormat(format);
  }
}
