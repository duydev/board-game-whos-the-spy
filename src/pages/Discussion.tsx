import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Clock, Key, UserCheck, ArrowRight, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGame } from '@/presentation/contexts/GameContext';
import { Timer } from '@/components/Timer';
import { PlayerCard } from '@/components/PlayerCard';

export const Discussion = () => {
  const { t } = useTranslation(['pages/discussion', 'common']);
  const navigate = useNavigate();
  const { gameState, nextDiscussionPlayer } = useGame();
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  useEffect(() => {
    if (!gameState) {
      navigate('/');
      return;
    }

    setCurrentPlayerIndex(gameState.currentDiscussionPlayerIndex);
  }, [gameState, navigate]);

  if (!gameState) return null;

  const activePlayers = gameState.players.filter((p) => !p.isEliminated);
  const currentPlayer = activePlayers[currentPlayerIndex];

  const handleNextPlayer = async () => {
    if (!gameState) return;
    if (currentPlayerIndex < activePlayers.length - 1) {
      try {
        await nextDiscussionPlayer();
        // State will update via context
      } catch (error) {
        console.error('Failed to move to next player:', error);
      }
    }
  };

  const handleFinishDiscussion = () => {
    navigate('/voting');
  };

  const handleTimeUp = () => {
    // Auto move to next player or finish discussion
    if (currentPlayerIndex < activePlayers.length - 1) {
      handleNextPlayer();
    }
  };

  const allPlayersDiscussed = currentPlayerIndex >= activePlayers.length - 1;

  return (
    <div className="max-w-4xl mx-auto space-y-8 lg:space-y-12">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Clock className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 text-primary animate-pulse" />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {t('title')}
          </h1>
        </div>
        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground">
          {t('round', { round: gameState.currentRound })}
        </p>
      </div>

      <div className="flex justify-center">
        <Timer initialTime={120} isRunning={true} onTimeUp={handleTimeUp} />
      </div>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-3 text-xl lg:text-2xl">
            <UserCheck className="h-6 w-6 text-primary" />
            {t('currentPlayer', { name: currentPlayer.name })}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center py-8 lg:py-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Key className="h-8 w-8 lg:h-10 lg:w-10 text-primary" />
              <p className="text-2xl lg:text-3xl font-bold">{t('yourKeyword')}</p>
            </div>
            <div className="text-5xl lg:text-6xl font-bold text-primary mb-6 animate-pulse">
              {currentPlayer.word || '?'}
            </div>
            {!currentPlayer.word && (
              <p className="text-base lg:text-lg text-muted-foreground">{t('spyMessage')}</p>
            )}
            {currentPlayer.word && (
              <p className="text-base lg:text-lg text-muted-foreground">{t('civilianMessage')}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {activePlayers.map((player, index) => (
              <PlayerCard
                key={player.id}
                player={player}
                isCurrent={index === currentPlayerIndex}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center pt-4">
        {!allPlayersDiscussed && (
          <Button onClick={handleNextPlayer} size="lg" className="w-full sm:w-auto">
            {t('common:buttons.nextPlayer')}
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        )}
        <Button onClick={handleFinishDiscussion} size="lg" className="w-full sm:w-auto">
          {t('common:buttons.finishDiscussion')}
          <CheckCircle className="h-5 w-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};
