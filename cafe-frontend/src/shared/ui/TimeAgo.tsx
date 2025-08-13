'use client';

import { useEffect, useState } from 'react';

interface TimeAgoProps {
  datetime: string;
}

export function TimeAgo({ datetime }: TimeAgoProps) {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    const updateTimeAgo = () => {
      const now = Date.now();
      const timestamp = new Date(datetime).getTime();
      const diff = Math.floor((now - timestamp) / 1000); // difference in seconds

      if (diff < 60) {
        setTimeAgo(`${diff}s ago`);
      } else if (diff < 3600) {
        const minutes = Math.floor(diff / 60);
        setTimeAgo(`${minutes}m ago`);
      } else if (diff < 86400) {
        const hours = Math.floor(diff / 3600);
        setTimeAgo(`${hours}h ago`);
      } else {
        const days = Math.floor(diff / 86400);
        setTimeAgo(`${days}d ago`);
      }
    };

    // Update immediately when mounted
    updateTimeAgo();

    // Update every second
    const interval = setInterval(updateTimeAgo, 1000);

    return () => clearInterval(interval);
  }, [datetime]);

  return <span>{timeAgo}</span>;
}