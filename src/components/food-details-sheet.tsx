'use client';

import type { FoodOption } from '@/lib/types';
import Image from 'next/image';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { HeavinessScore } from './heaviness-score';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from './ui/badge';
import { Upload } from 'lucide-react';

interface FoodDetailsSheetProps {
  food: FoodOption;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onBuy: (price: number, name: string) => void;
}

export function FoodDetailsSheet({
  food,
  isOpen,
  onOpenChange,
  onBuy,
}: FoodDetailsSheetProps) {
  const image = PlaceHolderImages.find(img => img.id === food.image.id);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="bg-card/95 backdrop-blur-sm border-t-primary border-t-2 rounded-t-2xl max-h-[85dvh] overflow-y-auto"
      >
        <SheetHeader className="text-left">
          {image && (
            <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
              <Image
                src={image.imageUrl}
                alt={food.name}
                fill
                className="object-cover"
                data-ai-hint={image.imageHint}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
            </div>
          )}
          <div className="flex justify-between items-start">
            <SheetTitle className="text-3xl font-bold font-headline text-foreground">
              {food.name}
            </SheetTitle>
            <Badge className="text-lg bg-primary text-primary-foreground hover:bg-primary/90">
              ${food.price.toFixed(2)}
            </Badge>
          </div>
          <SheetDescription className="text-muted-foreground pt-2 text-base">
            {food.generosityIndex}
          </SheetDescription>
        </SheetHeader>
        <div className="py-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2 text-primary font-headline">
              Heaviness Score
            </h3>
            <HeavinessScore score={food.heavinessScore} />
            <p className="text-sm text-muted-foreground mt-1">
              How full you'll feel. 5 is a food coma.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10 hover:text-primary"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Receipt
          </Button>
          <Button
            onClick={() => onBuy(food.price, food.name)}
            className="bg-primary text-primary-foreground hover:bg-primary/80"
          >
            I'm Gettin' It
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
