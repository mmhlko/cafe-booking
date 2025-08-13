import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import {
  VisitorEntryDto,
  DailyAnalyticsDto,
  HourlyStats,
  AnalyticsOverviewDto,
} from './dto/analytics.dto';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private readonly redisService: RedisService) {}

  /**
   * Записывает вход посетителя
   */
  async recordVisitorEntry(
    tableId: number,
    visitorId: string,
    guests: number,
  ): Promise<void> {
    try {
      const client = await this.redisService.getClient();
      const entry: VisitorEntryDto = {
        visitorId,
        tableId,
        entryTime: new Date().toISOString(),
        guests,
      };

      const today = new Date().toISOString().split('T')[0];
      const key = `analytics:visitors:${today}`;
      this.logger.debug({entry})
      // Добавляем запись в список посетителей за день
      await client.lpush(key, JSON.stringify(entry));

      // Устанавливаем TTL на 30 дней
      await client.expire(key, 30 * 24 * 60 * 60);

      this.logger.log(
        `Recorded visitor entry for table ${tableId} with ${guests} guests`,
      );
    } catch (error) {
      this.logger.error('Error recording visitor entry:', error);
      throw error;
    }
  }

  /**
   * Записывает выход посетителя и вычисляет время пребывания
   */
  async recordVisitorExit(tableId: number, visitorId: string): Promise<void> {
    this.logger.debug('recordVisitorExit')
    try {
      const client = await this.redisService.getClient();
      const today = new Date().toISOString().split('T')[0];
      const key = `analytics:visitors:${today}`;

      // Получаем все записи за сегодня
      const entries = await client.lrange(key, 0, -1);
      const visitorEntries: VisitorEntryDto[] = entries.map((entry) =>
        JSON.parse(entry),
      );

      // Находим активную сессию для этого стола
      const activeEntry = visitorEntries.find(
        (entry) => entry.tableId === tableId && entry.visitorId === visitorId && !entry.exitTime,
      );
      this.logger.debug({activeEntry})
      if (activeEntry) {
        const exitTime = new Date().toISOString();
        const entryTime = new Date(activeEntry.entryTime);
        const duration = Math.round(
          (new Date(exitTime).getTime() - entryTime.getTime()) / (1000 * 60),
        );

        // Обновляем запись
        activeEntry.exitTime = exitTime;
        activeEntry.duration = duration;

        // Удаляем старую запись и добавляем обновленную
        await client.lrem(
          key,
          1,
          JSON.stringify({
            tableId: activeEntry.tableId,
            entryTime: activeEntry.entryTime,
            guests: activeEntry.guests,
          }),
        );
        await client.lpush(key, JSON.stringify(activeEntry));

        this.logger.log(
          `Recorded visitor exit for table ${tableId}, duration: ${duration} minutes`,
        );
      }
    } catch (error) {
      this.logger.error('Error recording visitor exit:', error);
      throw error;
    }
  }

  /**
   * Получает аналитику за конкретный день
   */
  async getDailyAnalytics(date: string): Promise<DailyAnalyticsDto> {
    try {
      const client = await this.redisService.getClient();
      const key = `analytics:visitors:${date}`;

      const entries = await client.lrange(key, 0, -1);
      const visitorEntries: VisitorEntryDto[] = entries.map((entry) =>
        JSON.parse(entry),
      );

      if (visitorEntries.length === 0) {
        return this.createEmptyDailyAnalytics(date);
      }

      // Вычисляем статистику
      const totalVisitors = visitorEntries.reduce(
        (sum, entry) => sum + entry.guests,
        0,
      );
      const completedSessions = visitorEntries.filter(
        (entry) => entry.exitTime,
      );
      const activeSessions = visitorEntries.filter(
        (entry) => !entry.exitTime,
      ).length;

      const totalSessions = completedSessions.length + activeSessions;

      // Среднее время пребывания (только для завершенных сессий)
      const averageDuration =
        completedSessions.length > 0
          ? Math.round(
              completedSessions.reduce(
                (sum, entry) => sum + (entry.duration || 0),
                0,
              ) / completedSessions.length,
            )
          : 0;

      // Статистика по часам
      const hourlyStats = this.calculateHourlyStats(visitorEntries);

      return {
        date,
        totalVisitors,
        totalSessions,
        averageDuration,
        peakHours: hourlyStats,
        activeSessions,
      };
    } catch (error) {
      this.logger.error(`Error getting daily analytics for ${date}:`, error);
      throw error;
    }
  }

  /**
   * Получает аналитику за сегодня
   */
  async getTodayAnalytics(): Promise<DailyAnalyticsDto> {
    const today = new Date().toISOString().split('T')[0];
    return this.getDailyAnalytics(today);
  }

  /**
   * Получает обзор аналитики (сегодня, неделя, месяц)
   */
  async getAnalyticsOverview(): Promise<AnalyticsOverviewDto> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const todayAnalytics = await this.getTodayAnalytics();

      // Получаем данные за последние 7 дней
      const weekAnalytics: DailyAnalyticsDto[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        weekAnalytics.push(await this.getDailyAnalytics(dateStr));
      }

      // Получаем данные за последние 30 дней
      const monthAnalytics: DailyAnalyticsDto[] = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        monthAnalytics.push(await this.getDailyAnalytics(dateStr));
      }

      return {
        today: todayAnalytics,
        week: weekAnalytics,
        month: monthAnalytics,
      };
    } catch (error) {
      this.logger.error('Error getting analytics overview:', error);
      throw error;
    }
  }

  /**
   * Вычисляет статистику по часам
   */
  private calculateHourlyStats(entries: VisitorEntryDto[]): HourlyStats[] {
    const hourlyData: {
      [hour: number]: { visitors: number; sessions: number };
    } = {};

    // Инициализируем все часы
    for (let hour = 0; hour < 24; hour++) {
      hourlyData[hour] = { visitors: 0, sessions: 0 };
    }

    entries.forEach((entry) => {
      const entryHour = new Date(entry.entryTime).getHours();
      hourlyData[entryHour].visitors += entry.guests;
      hourlyData[entryHour].sessions += 1;
    });

    return Object.entries(hourlyData).map(([hour, stats]) => ({
      hour: parseInt(hour),
      visitors: stats.visitors,
      sessions: stats.sessions,
    }));
  }

  /**
   * Создает пустую аналитику для дня
   */
  private createEmptyDailyAnalytics(date: string): DailyAnalyticsDto {
    const emptyHourlyStats: HourlyStats[] = [];
    for (let hour = 0; hour < 24; hour++) {
      emptyHourlyStats.push({ hour, visitors: 0, sessions: 0 });
    }

    return {
      date,
      totalVisitors: 0,
      totalSessions: 0,
      averageDuration: 0,
      peakHours: emptyHourlyStats,
      activeSessions: 0,
    };
  }
}
