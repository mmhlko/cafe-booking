'use client';

import { TooltipProvider } from '@/components/ui/tooltip';
import { TableProvider } from '@/app/_contexts/TableContext';
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <TableProvider>
        {children}
      </TableProvider>
    </TooltipProvider>
  );
}
