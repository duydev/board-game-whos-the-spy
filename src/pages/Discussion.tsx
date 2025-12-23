import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';
import { Timer } from '@/components/Timer';
import { PlayerCard } from '@/components/PlayerCard';

export const Discussion = () => {
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

  const handleNextPlayer = () => {
    if (currentPlayerIndex < activePlayers.length - 1) {
      const nextIndex = currentPlayerIndex + 1;
      setCurrentPlayerIndex(nextIndex);
      nextDiscussionPlayer();
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
        <h1 className="text-4xl font-bold mb-2">Vòng thảo luận</h1>
        <p className="text-muted-foreground">Vòng {gameState.currentRound}</p>
      </div>

      <div className="flex justify-center">
        <Timer initialTime={120} isRunning={true} onTimeUp={handleTimeUp} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-center">Người chơi hiện tại: {currentPlayer.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            <p className="text-2xl font-bold mb-4">Từ khóa của bạn:</p>
            <div className="text-5xl font-bold text-primary mb-4">{currentPlayer.word || '?'}</div>
            {!currentPlayer.word && (
              <p className="text-muted-foreground">
                Bạn là gián điệp! Hãy cố gắng đoán và mô tả sao cho không bị phát hiện.
              </p>
            )}
            {currentPlayer.word && (
              <p className="text-muted-foreground">
                Hãy mô tả từ khóa này mà không nói trực tiếp từ đó.
              </p>
            )}
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
            Người tiếp theo
          </Button>
        )}
        <Button onClick={handleFinishDiscussion} size="lg" variant="default">
          Kết thúc thảo luận
        </Button>
      </div>
    </div>
  );
};
