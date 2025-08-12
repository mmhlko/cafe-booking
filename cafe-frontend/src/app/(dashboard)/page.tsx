'use client';

import { useWebSocket } from '@/app/_contexts/WebSocketContext';
import { useState } from 'react';
import { Tables } from '@/widgets/tables';
export default function ProductsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Tables />
      </div>
    </div>
  );
}
