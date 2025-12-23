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
    <div className="max-w-4xl mx-auto space-y-8 lg:space-y-12">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Eye className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 text-primary animate-pulse" />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {t('title')}
          </h1>
        </div>
        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground">
          {t('subtitle', { name: currentPlayer.name })}
        </p>
        <p className="text-sm lg:text-base text-muted-foreground">
          {t('progress', { current: currentPlayerIndex + 1, total: totalPlayers })}
        </p>
      </div>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl text-center justify-center">
            <Eye className="h-6 w-6 text-primary" />
            {t('yourRole')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-2xl mx-auto">
            <RoleCard player={currentPlayer} wordPair={gameState.wordPair} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center pt-4">
        <Button onClick={handleConfirm} size="lg" className="w-full sm:w-auto">
          {isLastPlayer ? (
            <>
              {t('startDiscussion')}
              <ArrowRight className="h-5 w-5 ml-2" />
            </>
          ) : (
            <>
              {t('confirmButton')}
              <CheckCircle className="h-5 w-5 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
