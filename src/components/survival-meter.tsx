'use client';

import { Progress } from '@/components/ui/progress';

interface SurvivalMeterProps {
  spent: number;
  limit: number;
}

export function SurvivalMeter({ spent, limit }: SurvivalMeterProps) {
  const progress = (spent / limit) * 100;

  return (
    <header className="fixed top-0 left-0 right-0 h-[76px] z-40 bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md mx-auto p-4 flex flex-col justify-center h-full">
        <div className="flex justify-between items-center mb-1 font-mono text-sm">
          <span className="text-primary font-bold">Daily Budget</span>
          <span>
            <span className="text-foreground">${spent.toFixed(2)}</span>
            <span className="text-muted-foreground"> / ${limit.toFixed(2)}</span>
          </span>
        </div>
        <Progress value={progress} className="h-2 [&>div]:bg-primary" />
      </div>
    </header>
  );
}
