import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { HourlyStats } from '../types';

interface HourlyChartProps {
  data: HourlyStats[];
  title?: string;
  type?: 'visitors' | 'sessions';
}

export function HourlyChart({ data, title = 'Hourly Activity', type = 'visitors' }: HourlyChartProps) {
  const maxValue = Math.max(...data.map(item => type === 'visitors' ? item.visitors : item.sessions));
  
  const formatHour = (hour: number) => {
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((item) => {
            const value = type === 'visitors' ? item.visitors : item.sessions;
            const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
            
            return (
              <div key={item.hour} className="flex items-center space-x-3">
                <div className="w-12 text-sm text-muted-foreground">
                  {formatHour(item.hour)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{value}</span>
                    <span className="text-xs text-muted-foreground">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}


