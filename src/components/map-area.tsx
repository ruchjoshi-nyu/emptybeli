'use client';

import type { FoodOption } from '@/lib/types';
import { MapPin } from './map-pin';

interface MapAreaProps {
  foodOptions: FoodOption[];
  onPinClick: (food: FoodOption) => void;
}

export function MapArea({ foodOptions, onPinClick }: MapAreaProps) {
  return (
    <div className="w-full h-full bg-background relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)] opacity-20"></div>
      </div>

      {/* Roads */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute top-[40%] -left-1/4 h-2 w-full rotate-[30deg] bg-orange-500/50 blur-sm"></div>
        <div className="absolute top-1/2 -right-1/4 h-1 w-full -rotate-[20deg] bg-orange-400/40 blur-sm"></div>
        <div className="absolute top-[60%] left-0 h-0.5 w-full bg-orange-500/30 blur-sm"></div>
      </div>
      
      {/* Buildings */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[10%] left-[10%] h-24 w-16 bg-primary/5 blur-sm rounded-sm"></div>
        <div className="absolute top-[25%] left-[60%] h-32 w-24 bg-secondary/5 blur-sm rounded-sm"></div>
        <div className="absolute bottom-[15%] right-[20%] h-40 w-20 bg-primary/10 blur-md rounded-t-lg"></div>
        <div className="absolute bottom-[5%] left-[30%] h-16 w-32 bg-secondary/10 blur-md rounded-sm"></div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background z-10" />

      <div className="absolute inset-0 z-20">
        {foodOptions.map(food => (
          <MapPin key={food.id} food={food} onClick={() => onPinClick(food)} />
        ))}
      </div>
    </div>
  );
}
