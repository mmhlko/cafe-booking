'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { StatCard } from './StatCard';
import { HourlyChart } from './HourlyChart';
import { WeeklyTrend } from './WeeklyTrend';
import { PeakHours } from './PeakHours';
import { RealtimeDashboard } from './RealtimeDashboard';
import { analyticsApi } from '../api/analyticsApi';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { 
  AnalyticsOverview, 
  PeakHoursData, 
} from '../types';
import { 
  Users, 
  Clock, 
  Activity, 
  TrendingUp, 
  BarChart3,
  RefreshCw,
  BarChart
} from 'lucide-react';

interface AnalyticsProps {
  className?: string;
}

export function Analytics({ className }: AnalyticsProps) {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [peakHours, setPeakHours] = useState<PeakHoursData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [overviewData, peakHoursData] = await Promise.all([
        analyticsApi.getAnalyticsOverview(),
        analyticsApi.getPeakHours(7)
      ]);

      setOverview(overviewData);
      setPeakHours(peakHoursData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      console.error('Analytics loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    loadData();
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !overview || !peakHours) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-muted-foreground">
              {error || 'No data available'}
            </div>
            <div className="mt-4 flex justify-center">
              <Button onClick={refreshData} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const today = overview.today;
  const weekData = overview.week;

  // Calculate trends (comparison with previous day)
  const yesterday = weekData[weekData.length - 2];
  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return { value: 0, isPositive: true };
    const change = ((current - previous) / previous) * 100;
    return { value: Math.abs(Math.round(change)), isPositive: change >= 0 };
  };

  const visitorsTrend = calculateTrend(today.totalVisitors, yesterday?.totalVisitors || 0);
  const sessionsTrend = calculateTrend(today.totalSessions, yesterday?.totalSessions || 0);
  const durationTrend = calculateTrend(today.averageDuration, yesterday?.averageDuration || 0);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Cafe attendance and activity statistics
          </p>
        </div>
        <Button onClick={refreshData} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Statistics cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Visitors"
          value={today.totalVisitors}
          description="Total number of visitors"
          icon={Users}
          trend={visitorsTrend}
          badge={{ text: 'Today', variant: 'default' }}
        />
        <StatCard
          title="Today's Sessions"
          value={today.totalSessions}
          description="Number of bookings"
          icon={Activity}
          trend={sessionsTrend}
          badge={{ text: `${today.activeSessions} active`, variant: 'secondary' }}
        />
        <StatCard
          title="Average Duration"
          value={`${today.averageDuration} min`}
          description="Visitor stay time"
          icon={Clock}
          trend={durationTrend}
        />
        <StatCard
          title="Peak Hours"
          value={peakHours.peakHours[0]?.hour.toString().padStart(2, '0') + ':00' || 'N/A'}
          description="Busiest hour"
          icon={TrendingUp}
        />
      </div>

      {/* Real-time dashboard */}
      <RealtimeDashboard 
        data={today}
        loading={loading}
        error={error}
        onRefresh={refreshData}
      />

      {/* Main content with tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="hourly">Hourly</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="peak">Peak Hours</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <HourlyChart 
              data={today.peakHours} 
              title="Today's Activity by Hour"
              type="visitors"
            />
            <WeeklyTrend 
              data={weekData} 
              title="Weekly Visitors"
              metric="totalVisitors"
            />
          </div>
        </TabsContent>

        <TabsContent value="hourly" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <HourlyChart 
              data={today.peakHours} 
              title="Visitors by Hour"
              type="visitors"
            />
            <HourlyChart 
              data={today.peakHours} 
              title="Sessions by Hour"
              type="sessions"
            />
          </div>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <WeeklyTrend 
              data={weekData} 
              title="Visitors"
              metric="totalVisitors"
            />
            <WeeklyTrend 
              data={weekData} 
              title="Sessions"
              metric="totalSessions"
            />
            <WeeklyTrend 
              data={weekData} 
              title="Average Duration"
              metric="averageDuration"
            />
          </div>
        </TabsContent>

        <TabsContent value="peak" className="space-y-4">
          <PeakHours 
            data={peakHours.peakHours}
            title="Top Peak Hours"
            period={peakHours.period}
          />
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Period Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Total Visitors</span>
                  </div>
                  <span className="text-2xl font-bold">{peakHours.totalVisitors}</span>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Total Sessions</span>
                  </div>
                  <span className="text-2xl font-bold">{peakHours.totalSessions}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

