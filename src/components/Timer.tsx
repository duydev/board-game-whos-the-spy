import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';

interface TimerProps {
  initialTime: number; // in seconds
  onTimeUp?: () => void;
  isRunning?: boolean;
}

export const Timer: React.FC<TimerProps> = ({ initialTime, onTimeUp, isRunning = true }) => {
  const { t } = useTranslation('components/timer');
  const [timeRemaining, setTimeRemaining] = useState(initialTime);

  useEffect(() => {
    setTimeRemaining(initialTime);
  }, [initialTime]);

  useEffect(() => {
    if (!isRunning || timeRemaining <= 0) {
      if (timeRemaining <= 0 && onTimeUp) {
        onTimeUp();
      }
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          if (onTimeUp) {
            onTimeUp();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeRemaining, onTimeUp]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const getColorClass = () => {
    if (timeRemaining <= 30) return 'text-destructive';
    if (timeRemaining <= 60) return 'text-orange-500';
    return 'text-primary';
  };

  return (
    <Card className="w-full max-w-xs mx-auto">
      <CardContent className="p-6">
        <div className="text-center">
          <div className={`text-4xl font-bold ${getColorClass()}`}>{formattedTime}</div>
          <div className="text-sm text-muted-foreground mt-2">
            {isRunning ? t('countingDown') : t('stopped')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
