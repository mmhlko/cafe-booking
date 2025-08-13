import {
  Controller,
  Get,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsResponseDto } from './dto/analytics.dto';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  /**
   * Получить аналитику за сегодня
   */
  @Get('today')
  @HttpCode(HttpStatus.OK)
  async getTodayAnalytics(): Promise<AnalyticsResponseDto> {
    try {
      const data = await this.analyticsService.getTodayAnalytics();
      return {
        success: true,
        data,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Получить аналитику за конкретную дату
   */
  @Get('daily/:date')
  @HttpCode(HttpStatus.OK)
  async getDailyAnalytics(@Param('date') date: string): Promise<AnalyticsResponseDto> {
    try {
      // Проверяем формат даты (YYYY-MM-DD)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        throw new BadRequestException('Invalid date format. Use YYYY-MM-DD');
      }

      const data = await this.analyticsService.getDailyAnalytics(date);
      return {
        success: true,
        data,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Получить обзор аналитики (сегодня, неделя, месяц)
   */
  @Get('overview')
  @HttpCode(HttpStatus.OK)
  async getAnalyticsOverview() {
    try {
      const data = await this.analyticsService.getAnalyticsOverview();
      return {
        success: true,
        data,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw error;;
    }
  }

  /**
   * Получить пиковые часы за период
   */
  @Get('peak-hours')
  @HttpCode(HttpStatus.OK)
  async getPeakHours(@Query('days') days: string = '7') {
    try {
      const daysCount = parseInt(days, 10);
      if (isNaN(daysCount) || daysCount < 1 || daysCount > 30) {
        throw new BadRequestException('Days parameter must be between 1 and 30');
      }

      const overview = await this.analyticsService.getAnalyticsOverview();
      const relevantDays = overview.week.slice(-daysCount);
      
      // Агрегируем данные по часам
      const hourlyAggregation: { [hour: number]: { visitors: number; sessions: number } } = {};
      
      for (let hour = 0; hour < 24; hour++) {
        hourlyAggregation[hour] = { visitors: 0, sessions: 0 };
      }

      relevantDays.forEach(day => {
        day.peakHours.forEach(hourStats => {
          hourlyAggregation[hourStats.hour].visitors += hourStats.visitors;
          hourlyAggregation[hourStats.hour].sessions += hourStats.sessions;
        });
      });

      // Сортируем по количеству посетителей
      const peakHours = Object.entries(hourlyAggregation)
        .map(([hour, stats]) => ({
          hour: parseInt(hour),
          visitors: stats.visitors,
          sessions: stats.sessions,
        }))
        .sort((a, b) => b.visitors - a.visitors)
        .slice(0, 5); // Топ-5 пиковых часов

      return {
        success: true,
        data: {
          period: `${daysCount} days`,
          peakHours,
          totalVisitors: relevantDays.reduce((sum, day) => sum + day.totalVisitors, 0),
          totalSessions: relevantDays.reduce((sum, day) => sum + day.totalSessions, 0),
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw error;
    }
  }
}
