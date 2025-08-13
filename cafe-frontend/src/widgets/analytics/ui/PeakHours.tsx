import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { HourlyStats } from '../types';
import { Clock, Users, Activity } from 'lucide-react';

interface PeakHoursProps {
  data: HourlyStats[];
  title?: string;
  period?: string;
}

export function PeakHours({ data, title = 'Peak Hours', period }: PeakHoursProps) {
  const formatHour = (hour: number) => {
    return `${hour.toString().padStart(2, '0')}:00`;
  };

  const getTimeOfDay = (hour: number) => {
    if (hour >= 6 && hour < 12) return 'Morning';
    if (hour >= 12 && hour < 18) return 'Afternoon';
    if (hour >= 18 && hour < 23) return 'Evening';
    return 'Night';
  };

  const getTimeOfDayColor = (hour: number) => {
    if (hour >= 6 && hour < 12) return 'bg-yellow-100 text-yellow-800';
    if (hour >= 12 && hour < 18) return 'bg-blue-100 text-blue-800';
    if (hour >= 18 && hour < 23) return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {title}
        </CardTitle>
        {period && (
          <p className="text-sm text-muted-foreground">Period: {period}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={item.hour} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="font-mono">
                    {formatHour(item.hour)}
                  </Badge>
                  <Badge className={getTimeOfDayColor(item.hour)}>
                    {getTimeOfDay(item.hour)}
                  </Badge>
                </div>
                {index === 0 && (
                  <Badge variant="destructive" className="text-xs">
                    Peak
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{item.visitors}</span>
                  <span className="text-xs text-muted-foreground">visitors</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{item.sessions}</span>
                  <span className="text-xs text-muted-foreground">sessions</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

