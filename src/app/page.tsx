'use client';

import type { FoodOption } from '@/lib/types';
import { foodOptions } from '@/lib/data';
import { useState, useCallback } from 'react';
import { SurvivalMeter } from '@/components/survival-meter';
import { MapArea } from '@/components/map-area';
import { FoodDetailsSheet } from '@/components/food-details-sheet';
import { HangryMode } from '@/components/hangry-mode';
import { evaluateFoodOptionValue } from '@/ai/flows/evaluate-food-option-value';
import { useToast } from '@/hooks/use-toast';

const DAILY_BUDGET = 15.0;

export default function Home() {
  const [spent, setSpent] = useState(4.5);
  const [selectedFood, setSelectedFood] = useState<FoodOption | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { toast } = useToast();

  const handlePinClick = (food: FoodOption) => {
    setSelectedFood(food);
    setIsSheetOpen(true);
  };

  const handleSheetChange = (open: boolean) => {
    setIsSheetOpen(open);
    if (!open) {
      // Delay clearing selected food to allow for exit animation
      setTimeout(() => setSelectedFood(null), 300);
    }
  };

  const handleBuy = (price: number, name: string) => {
    if (spent + price > DAILY_BUDGET) {
      toast({
        variant: 'destructive',
        title: 'Budget Exceeded',
        description: "You can't afford this right now.",
      });
      return;
    }
    setSpent(prev => prev + price);
    setIsSheetOpen(false);
    toast({
      title: 'Purchase Successful!',
      description: `You spent $${price.toFixed(
        2
      )} on ${name}. Your stomach is temporarily satisfied.`,
      className: 'bg-primary text-primary-foreground border-primary',
    });
  };

  const handleHangryModeResult = useCallback(
    async (food: FoodOption) => {
      setSelectedFood(food);
      setIsSheetOpen(true);

      try {
        const result = await evaluateFoodOptionValue({
          foodName: food.name,
          foodPrice: food.price,
          remainingBudget: DAILY_BUDGET - spent,
        });
        toast({
          title: `Found ${food.name}!`,
          description: result.valueJudgment,
        });
      } catch (error) {
        console.error('AI evaluation failed:', error);
        toast({
          title: `Found ${food.name}!`,
          description: `A solid choice for $${food.price.toFixed(2)}.`,
        });
      }
    },
    [spent, toast]
  );

  return (
    <div className="min-h-screen bg-background font-body text-foreground flex flex-col items-center overflow-hidden">
      <main className="w-full max-w-md h-[100dvh] flex flex-col relative shadow-2xl shadow-primary/10">
        <div className="relative flex-grow">
          <SurvivalMeter spent={spent} limit={DAILY_BUDGET} />
          <div className="pt-[76px] h-full">
            <MapArea foodOptions={foodOptions} onPinClick={handlePinClick} />
          </div>

          <HangryMode
            foodOptions={foodOptions}
            onFoodFound={handleHangryModeResult}
          />
        </div>
        {selectedFood && (
          <FoodDetailsSheet
            food={selectedFood}
            isOpen={isSheetOpen}
            onOpenChange={handleSheetChange}
            onBuy={handleBuy}
          />
        )}
      </main>
    </div>
  );
}
