import { Loader2 } from 'lucide-react';

interface LoadingProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Loading({ text = 'Загрузка...', size = 'md' }: LoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className="flex items-center justify-center space-x-2 p-4">
      <Loader2 className={`${sizeClasses[size]} animate-spin`} />
      <span className="text-sm text-muted-foreground">{text}</span>
    </div>
  );
}

