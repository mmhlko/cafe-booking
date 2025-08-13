export interface VisitorEntry {
  visitorId: string;
  tableId: number;
  entryTime: string;
  exitTime?: string;
  duration?: number;
  guests: number;
}

export interface HourlyStats {
  hour: number;
  visitors: number;
  sessions: number;
}

export interface DailyAnalytics {
  date: string;
  totalVisitors: number;
  totalSessions: number;
  averageDuration: number;
  peakHours: HourlyStats[];
  activeSessions: number;
}

export interface AnalyticsResponse {
  success: boolean;
  data: DailyAnalytics;
  timestamp: string;
}

export interface AnalyticsOverview {
  today: DailyAnalytics;
  week: DailyAnalytics[];
  month: DailyAnalytics[];
}

export interface AnalyticsOverviewResponse {
  success: boolean;
  data: AnalyticsOverview;
  timestamp: string;
}

export interface PeakHoursData {
  period: string;
  peakHours: HourlyStats[];
  totalVisitors: number;
  totalSessions: number;
}

export interface PeakHoursResponse {
  success: boolean;
  data: PeakHoursData;
  timestamp: string;
}

