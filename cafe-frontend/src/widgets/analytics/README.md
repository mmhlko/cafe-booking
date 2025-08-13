# Analytics Widget

## Overview

The Analytics widget provides comprehensive cafe attendance and activity statistics with real-time data visualization.

## Structure

```
analytics/
├── api/
│   └── analyticsApi.ts      # API client for analytics endpoints
├── types/
│   └── index.ts            # TypeScript interfaces
├── ui/
│   ├── Analytics.tsx       # Main analytics component
│   ├── StatCard.tsx        # Statistics card component
│   ├── HourlyChart.tsx     # Hourly activity chart
│   ├── WeeklyTrend.tsx     # Weekly trends chart
│   ├── PeakHours.tsx       # Peak hours display
│   └── RealtimeDashboard.tsx # Real-time dashboard
└── index.ts                # Public exports
```

## Components

### Analytics (Main Component)
The main analytics widget that combines all features.

**Props:**
- `className?: string` - Additional CSS classes

**Features:**
- Statistics cards with trends
- Real-time dashboard
- Tabbed interface (Overview, Hourly, Weekly, Peak Hours)
- Automatic data refresh
- Error handling

### StatCard
Displays individual statistics with optional trends and badges.

**Props:**
- `title: string` - Card title
- `value: string | number` - Statistic value
- `description?: string` - Optional description
- `icon: LucideIcon` - Icon component
- `trend?: { value: number; isPositive: boolean }` - Trend data
- `badge?: { text: string; variant?: string }` - Badge data

### HourlyChart
Shows activity data by hour with progress bars.

**Props:**
- `data: HourlyStats[]` - Hourly statistics data
- `title?: string` - Chart title
- `type?: 'visitors' | 'sessions'` - Data type to display

### WeeklyTrend
Displays weekly trends as bar charts.

**Props:**
- `data: DailyAnalytics[]` - Weekly data
- `title?: string` - Chart title
- `metric: 'totalVisitors' | 'totalSessions' | 'averageDuration'` - Metric to display

### PeakHours
Shows peak hours with time-of-day indicators.

**Props:**
- `data: HourlyStats[]` - Peak hours data
- `title?: string` - Component title
- `period?: string` - Time period

### RealtimeDashboard
Real-time statistics display with live clock.

**Props:**
- `data: DailyAnalytics | null` - Today's data
- `loading?: boolean` - Loading state
- `error?: string | null` - Error message
- `onRefresh?: () => void` - Refresh callback

## API

### AnalyticsApi Class

**Methods:**
- `getTodayAnalytics()` - Get today's analytics
- `getDailyAnalytics(date: string)` - Get analytics for specific date
- `getAnalyticsOverview()` - Get overview (today, week, month)
- `getPeakHours(days: number)` - Get peak hours for period
- `recordVisitorEntry(tableId, visitorId, guests)` - Record visitor entry
- `recordVisitorExit(tableId, visitorId)` - Record visitor exit

## Types

### Core Types
- `DailyAnalytics` - Daily statistics
- `HourlyStats` - Hourly statistics
- `AnalyticsOverview` - Overview data structure
- `PeakHoursData` - Peak hours data structure

## Usage

### Basic Usage
```tsx
import { Analytics } from '@/widgets/analytics';

function MyPage() {
  return <Analytics />;
}
```

### Individual Components
```tsx
import { StatCard, HourlyChart, WeeklyTrend } from '@/widgets/analytics';
import { Users } from 'lucide-react';

function CustomAnalytics() {
  return (
    <div>
      <StatCard
        title="Visitors"
        value={150}
        icon={Users}
        trend={{ value: 12, isPositive: true }}
      />
      <HourlyChart data={hourlyData} />
      <WeeklyTrend data={weeklyData} metric="totalVisitors" />
    </div>
  );
}
```

### API Usage
```tsx
import { analyticsApi } from '@/widgets/analytics';

// Get today's analytics
const todayData = await analyticsApi.getTodayAnalytics();

// Get overview
const overview = await analyticsApi.getAnalyticsOverview();

// Record visitor entry
await analyticsApi.recordVisitorEntry(1, 'visitor-123', 4);
```

## Features

1. **Real-time Updates** - Automatic data refresh
2. **Trend Analysis** - Comparison with previous periods
3. **Responsive Design** - Works on all screen sizes
4. **Error Handling** - Graceful error states
5. **Loading States** - Smooth loading experience
6. **Interactive Charts** - Hover effects and animations
7. **Time-of-day Indicators** - Color-coded peak hours
8. **Export Ready** - Clean component structure for reuse

## Styling

The widget uses Tailwind CSS classes and follows the design system:
- Cards with consistent spacing
- Color-coded indicators
- Responsive grid layouts
- Smooth transitions and animations

## Dependencies

- React 18+
- TypeScript
- Tailwind CSS
- Lucide React (icons)
- Radix UI components



