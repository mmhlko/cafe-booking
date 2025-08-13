import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { DailyAnalytics } from '../types';

interface WeeklyTrendProps {
  data: DailyAnalytics[];
  title?: string;
  metric: 'totalVisitors' | 'totalSessions' | 'averageDuration';
}

export function WeeklyTrend({ data, title = 'Weekly Trend', metric }: WeeklyTrendProps) {
  const getMetricValue = (item: DailyAnalytics) => {
    switch (metric) {
      case 'totalVisitors':
        return item.totalVisitors;
      case 'totalSessions':
        return item.totalSessions;
      case 'averageDuration':
        return item.averageDuration;
      default:
        return 0;
    }
  };

  const getMetricLabel = () => {
    switch (metric) {
      case 'totalVisitors':
        return 'Visitors';
      case 'totalSessions':
        return 'Sessions';
      case 'averageDuration':
        return 'Avg. Duration (min)';
      default:
        return '';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const maxValue = Math.max(...data.map(item => getMetricValue(item)));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            {getMetricLabel()}
          </div>
          <div className="flex items-end justify-between space-x-2 h-32">
            {data.map((item, index) => {
              const value = getMetricValue(item);
              const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
              
              return (
                <div key={item.date} className="flex flex-col items-center space-y-2 flex-1">
                  <div className="text-xs font-medium text-center">
                    {value}
                  </div>
                  <div 
                    className="w-full bg-blue-600 rounded-t transition-all duration-300 min-h-[4px]"
                    style={{ height: `${percentage}%` }}
                  />
                  <div className="text-xs text-muted-foreground text-center">
                    {formatDate(item.date)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


