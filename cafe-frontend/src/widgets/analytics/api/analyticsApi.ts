import { ApiBase } from "@/shared/lib/api/apiBase";
import { apiRoutes } from "@/shared/lib/api/apiRoutes";
import { 
  AnalyticsResponse, 
  AnalyticsOverviewResponse, 
  PeakHoursResponse,
  DailyAnalytics, 
  PeakHoursData,
  AnalyticsOverview
} from "../types";

export class AnalyticsApi extends ApiBase {
  constructor() {
    super();
    this.api.defaults.withCredentials = true;
  }

  /**
   * Get today's analytics
   */
  public getTodayAnalytics = async (): Promise<DailyAnalytics | null> => {
    try {
      const { data } = await this.api.get<AnalyticsResponse>(`${apiRoutes.analytics.baseRoute}/today`);
      return data.success ? data.data : null;
    } catch (error: unknown) {
      this.handleError(error, 'Get Today Analytics');
      return null;
    }
  };

  /**
   * Get analytics for specific date
   */
  public getDailyAnalytics = async (date: string): Promise<DailyAnalytics | null> => {
    try {
      const { data } = await this.api.get<AnalyticsResponse>(`${apiRoutes.analytics.baseRoute}/daily/${date}`);
      return data.success ? data.data : null;
    } catch (error: unknown) {
      this.handleError(error, `Get Daily Analytics for ${date}`);
      return null;
    }
  };

  /**
   * Get analytics overview (today, week, month)
   */
  public getAnalyticsOverview = async (): Promise<AnalyticsOverview | null> => {
    try {
      const { data } = await this.api.get<AnalyticsOverviewResponse>(`${apiRoutes.analytics.baseRoute}/overview`);
      return data.success ? data.data : null;
    } catch (error: unknown) {
      this.handleError(error, 'Get Analytics Overview');
      return null;
    }
  };

  /**
   * Get peak hours for specified period
   */
  public getPeakHours = async (days: number = 7): Promise<PeakHoursData | null> => {
    try {
      const { data } = await this.api.get<PeakHoursResponse>(`${apiRoutes.analytics.baseRoute}/peak-hours?days=${days}`);
      return data.success ? data.data : null;
    } catch (error: unknown) {
      this.handleError(error, `Get Peak Hours for ${days} days`);
      return null;
    }
  };

  /**
   * Record visitor entry
   */
  public recordVisitorEntry = async (
    tableId: number, 
    visitorId: string, 
    guests: number
  ): Promise<boolean> => {
    try {
      await this.api.post(`${apiRoutes.analytics.baseRoute}/visitor-entry`, {
        tableId,
        visitorId,
        guests
      });
      return true;
    } catch (error: unknown) {
      this.handleError(error, `Record Visitor Entry for Table #${tableId}`);
      return false;
    }
  };

  /**
   * Record visitor exit
   */
  public recordVisitorExit = async (
    tableId: number, 
    visitorId: string
  ): Promise<boolean> => {
    try {
      await this.api.post(`${apiRoutes.analytics.baseRoute}/visitor-exit`, {
        tableId,
        visitorId
      });
      return true;
    } catch (error: unknown) {
      this.handleError(error, `Record Visitor Exit for Table #${tableId}`);
      return false;
    }
  };
}

export const analyticsApi = new AnalyticsApi();


