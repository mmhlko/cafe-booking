'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { DailyAnalytics } from '../types';
import { Users, Clock, Activity, TrendingUp } from 'lucide-react';

interface RealtimeDashboardProps {
  data: DailyAnalytics | null;
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

export function RealtimeDashboard({ data, loading = false, error = null, onRefresh }: RealtimeDashboardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Real-time Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Real-time Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            {error || 'No data available'}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Real-time Dashboard</span>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="font-mono">
              {formatTime(currentTime)}
            </Badge>
            <Badge variant="secondary">Today</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center space-x-3 p-3 border rounded-lg">
            <Users className="h-8 w-8 text-blue-600" />
            <div>
              <div className="text-2xl font-bold">{data.totalVisitors}</div>
              <div className="text-sm text-muted-foreground">Visitors</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 border rounded-lg">
            <Activity className="h-8 w-8 text-green-600" />
            <div>
              <div className="text-2xl font-bold">{data.totalSessions}</div>
              <div className="text-sm text-muted-foreground">Sessions</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 border rounded-lg">
            <Clock className="h-8 w-8 text-orange-600" />
            <div>
              <div className="text-2xl font-bold">{data.averageDuration}</div>
              <div className="text-sm text-muted-foreground">Avg. min</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 border rounded-lg">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <div>
              <div className="text-2xl font-bold">{data.activeSessions}</div>
              <div className="text-sm text-muted-foreground">Active</div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <div className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleTimeString('en-US')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}



