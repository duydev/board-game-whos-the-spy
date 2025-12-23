import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Eye, CheckCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGame } from '@/presentation/contexts/GameContext';
import { RoleCard } from '@/components/RoleCard';

export const ViewRole = () => {
  const { t } = useTranslation(['pages/viewRole', 'common']);
  const navigate = useNavigate();
  const { gameState } = useGame();
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  useEffect(() => {
    if (!gameState) {
      navigate('/');
      return;
    }
    // Reset to first player when component mounts
    setCurrentPlayerIndex(0);
  }, [gameState, navigate]);

  if (!gameState) return null;

  const currentPlayer = gameState.players[currentPlayerIndex];
  const totalPlayers = gameState.players.length;
  const isLastPlayer = currentPlayerIndex >= totalPlayers - 1;

  const handleConfirm = () => {
    if (isLastPlayer) {
      // All players have viewed their roles, navigate to discussion
      navigate('/discussion');
    } else {
      // Move to next player
      setCurrentPlayerIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 md:space-y-10">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Eye className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-primary" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">{t('title')}</h1>
        </div>
        <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
          {t('subtitle', { name: currentPlayer.name })}
        </p>
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-2">
          {t('progress', { current: currentPlayerIndex + 1, total: totalPlayers })}
        </p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-center justify-center">
            <Eye className="h-5 w-5 text-primary" />
            {t('yourRole')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-2xl mx-auto">
            <RoleCard player={currentPlayer} wordPair={gameState.wordPair} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button
          onClick={handleConfirm}
          size="lg"
          className="w-full sm:w-auto min-h-[44px] text-base md:text-lg"
        >
          {isLastPlayer ? (
            <>
              {t('startDiscussion')}
              <ArrowRight className="h-4 w-4 md:h-5 md:w-5 ml-2" />
            </>
          ) : (
            <>
              {t('confirmButton')}
              <CheckCircle className="h-4 w-4 md:h-5 md:w-5 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
