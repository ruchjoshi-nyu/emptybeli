import { ToyBrick } from 'lucide-react';
import { cn } from '@/lib/utils';

type HeavinessScoreProps = {
  score: number;
  className?: string;
};

export function HeavinessScore({ score, className }: HeavinessScoreProps) {
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      {Array.from({ length: 5 }).map((_, i) => (
        <ToyBrick
          key={i}
          className={cn(
            'h-6 w-6 transition-colors',
            i < score ? 'text-primary' : 'text-muted-foreground/20'
          )}
          fill={i < score ? 'currentColor' : 'transparent'}
        />
      ))}
    </div>
  );
}
