import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/shared/ui/button';

interface ErrorProps {
  message: string;
  onRetry?: () => void;
}

export function Error({ message, onRetry }: ErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center">
      <AlertCircle className="h-12 w-12 text-red-500" />
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Ошибка загрузки</h3>
        <p className="text-sm text-gray-600 mt-1">{message}</p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="flex items-center space-x-2">
          <RefreshCw className="h-4 w-4" />
          <span>Повторить</span>
        </Button>
      )}
    </div>
  );
}

