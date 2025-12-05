'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, Zap } from 'lucide-react';
import type { FoodOption } from '@/lib/types';
import { Button } from './ui/button';
import { findFoodOnABudget } from '@/ai/flows/find-food-on-a-budget';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { Card, CardContent } from './ui/card';
import { cn } from '@/lib/utils';

interface HangryModeProps {
  foodOptions: FoodOption[];
  onFoodFound: (food: FoodOption) => void;
}

type Status = 'idle' | 'listening' | 'processing' | 'speaking';

export function HangryMode({ foodOptions, onFoodFound }: HangryModeProps) {
  const [status, setStatus] = useState<Status>('idle');
  const [statusText, setStatusText] = useState('Press to find food');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const resetState = useCallback(() => {
    setStatus('idle');
    setStatusText('Press to find food');
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
  }, []);

  const handleFoodFound = useCallback(
    (food: FoodOption) => {
      onFoodFound(food);
      resetState();
    },
    [onFoodFound, resetState]
  );

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('SpeechRecognition API not supported.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setStatus('listening');
      setStatusText('Listening...');
    };

    recognition.onend = () => {
      if (status === 'listening') {
        resetState();
      }
    };

    recognition.onerror = event => {
      console.error('Speech recognition error:', event.error);
      if (event.error !== 'aborted') {
        setStatusText('Mic error. Try again?');
        setTimeout(resetState, 2000);
      }
    };

    recognition.onresult = async event => {
      const userQuery = event.results[0][0].transcript;
      setStatus('processing');
      setStatusText(`Thinking about: "${userQuery}"`);

      try {
        const result = await findFoodOnABudget({
          userQuery,
          foodOptions,
        });

        setStatus('speaking');
        setStatusText(result.response);
        
        const { audio } = await textToSpeech(result.response);

        if (audioRef.current) {
          audioRef.current.src = audio;
          audioRef.current.play();
        }
        
        const foundFood = foodOptions.find(f => f.id === result.foodId);
        if (foundFood) {
          if (audioRef.current) {
            audioRef.current.onended = () => {
              handleFoodFound(foundFood);
            };
          } else {
            handleFoodFound(foundFood);
          }
        } else {
           if (audioRef.current) {
            audioRef.current.onended = () => {
              resetState();
            };
          } else {
            resetState();
          }
        }
      } catch (error) {
        console.error('Hangry Mode AI processing failed:', error);
        setStatusText('Could not compute. Brain is empty.');
        setTimeout(resetState, 2000);
      }
    };

    recognitionRef.current = recognition;
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    return () => {
      recognition.abort();
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [foodOptions, handleFoodFound, resetState]);

  const handleActivation = () => {
    if (!recognitionRef.current) {
      alert('Voice recognition is not supported by your browser.');
      return;
    }
    if (status !== 'idle') {
      resetState();
      return;
    }

    recognitionRef.current.start();
  };

  const handlePopupClick = () => {
    if (status !== 'idle') {
      resetState();
    }
  };

  const isBusy = status !== 'idle';
  const showStatusPopup = isBusy && statusText !== 'Press to find food';

  return (
    <div
      className={cn(
        'absolute bottom-6 left-1/2 -translate-x-1/2 w-full flex flex-col items-center gap-4 z-50'
      )}
    >
      {showStatusPopup && (
        <Card
          onClick={handlePopupClick}
          className="w-11/12 max-w-sm bg-card/90 backdrop-blur-sm border-primary shadow-lg shadow-primary/20 animate-in fade-in-0 slide-in-from-bottom-5 cursor-pointer"
        >
          <CardContent className="p-4 text-center text-lg font-medium text-primary">
            {statusText}
          </CardContent>
        </Card>
      )}
       <div className={cn(isBusy && 'opacity-0 pointer-events-none')}>
        <Button
          size="icon"
          onClick={handleActivation}
          className={cn(
            'relative w-20 h-20 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90 disabled:bg-primary/70',
            { 'disabled:opacity-100': isBusy }
          )}
          aria-label="Activate Hangry Mode"
        >
          {status === 'listening' && (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-background opacity-75"></span>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-background opacity-50 delay-500"></span>
            </>
          )}
          {status === 'processing' || status === 'speaking' ? (
            <Zap className="w-10 h-10 animate-pulse" />
          ) : (
            <Mic className="w-10 h-10" />
          )}
        </Button>
      </div>
      <audio ref={audioRef} className="hidden" />
    </div>
  );
}
