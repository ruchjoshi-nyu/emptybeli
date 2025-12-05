'use client';

import type { FoodOption } from '@/lib/types';
import { cn } from '@/lib/utils';

interface MapPinProps {
  food: FoodOption;
  onClick: () => void;
}

const getPriceColor = (price: number): string => {
  if (price < 5) {
    return 'bg-green-600 text-white';
  }
  if (price <= 10) {
    return 'bg-yellow-500 text-white';
  }
  return 'bg-red-600 text-white';
};

export function MapPin({ food, onClick }: MapPinProps) {
  const colorClasses = getPriceColor(food.price);

  return (
    <button
      onClick={onClick}
      className="absolute group transform -translate-x-1/2 -translate-y-1/2 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background rounded-full"
      style={{ top: food.position.top, left: food.position.left }}
      aria-label={`View details for ${food.name}`}
    >
      <div
        className={cn(
          'w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg transition-all duration-200 transform group-hover:scale-110 group-focus:scale-110',
          colorClasses
        )}
      >
        ${food.price < 1 ? food.price.toFixed(2) : Math.floor(food.price)}
      </div>
      <div
        className={cn(
          'w-12 h-12 rounded-full absolute top-0 left-0 animate-ping opacity-50',
          colorClasses
        )}
      ></div>
      <p className="absolute -bottom-7 left-1/2 -translate-x-1/2 w-max text-sm bg-card/80 backdrop-blur-sm px-2 py-1 rounded-md transition-all opacity-0 group-hover:opacity-100 group-focus:opacity-100 font-medium text-foreground">
        {food.name}
      </p>
    </button>
  );
}
