import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock } from 'lucide-react';
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

  const getProgressPercentage = () => {
    return (timeRemaining / initialTime) * 100;
  };

  return (
    <Card className="w-full max-w-xs sm:max-w-sm lg:max-w-md mx-auto shadow-lg border-2 hover:shadow-xl transition-shadow duration-300">
      <CardContent className="p-6 lg:p-8">
        <div className="text-center space-y-4 lg:space-y-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Clock className={`h-8 w-8 lg:h-10 lg:w-10 ${getColorClass()} animate-pulse`} />
            <div className={`text-4xl lg:text-5xl font-bold ${getColorClass()} tabular-nums`}>
              {formattedTime}
            </div>
          </div>
          <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ease-linear ${
                timeRemaining <= 30
                  ? 'bg-destructive'
                  : timeRemaining <= 60
                    ? 'bg-orange-500'
                    : 'bg-primary'
              }`}
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
          <div className="text-sm lg:text-base text-muted-foreground">
            {isRunning ? t('countingDown') : t('stopped')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
