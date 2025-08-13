export class VisitorEntryDto {
  visitorId: string;
  tableId: number;
  entryTime: string; // ISO string
  exitTime?: string; // ISO string, optional for active sessions
  duration?: number; // in minutes
  guests: number;
}

export class DailyAnalyticsDto {
  date: string; // YYYY-MM-DD format
  totalVisitors: number;
  totalSessions: number;
  averageDuration: number; // in minutes
  peakHours: HourlyStats[];
  activeSessions: number;
}

export class HourlyStats {
  hour: number; // 0-23
  visitors: number;
  sessions: number;
}

export class AnalyticsResponseDto {
  success: boolean;
  data: DailyAnalyticsDto;
  timestamp: string;
}

export class AnalyticsOverviewDto {
  today: DailyAnalyticsDto;
  week: DailyAnalyticsDto[];
  month: DailyAnalyticsDto[];
}
