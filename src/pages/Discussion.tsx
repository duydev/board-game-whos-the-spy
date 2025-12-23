import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
        <p className="text-muted-foreground">{t('round', { round: gameState.currentRound })}</p>
      </div>

      <div className="flex justify-center">
        <Timer initialTime={120} isRunning={true} onTimeUp={handleTimeUp} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            {t('currentPlayer', { name: currentPlayer.name })}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            <p className="text-2xl font-bold mb-4">{t('yourKeyword')}</p>
            <div className="text-5xl font-bold text-primary mb-4">{currentPlayer.word || '?'}</div>
            {!currentPlayer.word && <p className="text-muted-foreground">{t('spyMessage')}</p>}
            {currentPlayer.word && <p className="text-muted-foreground">{t('civilianMessage')}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
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

      <div className="flex gap-4 justify-center">
        {!allPlayersDiscussed && (
          <Button onClick={handleNextPlayer} size="lg">
            {t('common:buttons.nextPlayer')}
          </Button>
        )}
        <Button onClick={handleFinishDiscussion} size="lg" variant="default">
          {t('common:buttons.finishDiscussion')}
        </Button>
      </div>
    </div>
  );
};
