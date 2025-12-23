import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGame } from '@/presentation/contexts/GameContext';
import { RoleCard } from '@/components/RoleCard';

export const GameResult = () => {
  const { t } = useTranslation(['pages/gameResult', 'common']);
  const navigate = useNavigate();
  const { gameState, resetGame } = useGame();

  if (!gameState) {
    navigate('/');
    return null;
  }

  const handlePlayAgain = async () => {
    // Keep same players, reset game
    try {
      await resetGame();
      navigate('/enter-names');
    } catch (error) {
      console.error('Failed to reset game:', error);
    }
  };

  const handleNewGroup = async () => {
    try {
      await resetGame();
      navigate('/');
    } catch (error) {
      console.error('Failed to reset game:', error);
    }
  };

  const winnerText = gameState.winner === 'civilians' ? t('civiliansWin') : t('spiesWin');
  const winnerColor = gameState.winner === 'civilians' ? 'text-green-600' : 'text-red-600';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
        <h2 className={`text-3xl font-bold ${winnerColor} mt-4`}>{winnerText}</h2>
      </div>

      {gameState.wordPair && (
        <Card>
          <CardHeader>
            <CardTitle>{t('wordPairUsed')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {gameState.wordPair[0]} - {gameState.wordPair[1]}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t('playerRoles')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {gameState.players.map((player) => (
              <RoleCard key={player.id} player={player} wordPair={gameState.wordPair} />
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 justify-center">
        <Button onClick={handlePlayAgain} size="lg" variant="outline">
          {t('common:buttons.playAgain')}
        </Button>
        <Button onClick={handleNewGroup} size="lg">
          {t('common:buttons.newGroup')}
        </Button>
      </div>
    </div>
  );
};
