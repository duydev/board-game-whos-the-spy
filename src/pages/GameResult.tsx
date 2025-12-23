import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Trophy, Key, Users, RotateCcw } from 'lucide-react';
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
  const winnerColor = gameState.winner === 'civilians' ? 'text-primary' : 'text-destructive';

  return (
    <div className="max-w-4xl mx-auto space-y-8 lg:space-y-12">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Trophy className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 text-primary animate-pulse" />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {t('title')}
          </h1>
        </div>
        <div className="flex items-center justify-center gap-3 mt-6">
          <Trophy className={`h-8 w-8 lg:h-10 lg:w-10 ${winnerColor} animate-bounce`} />
          <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${winnerColor}`}>
            {winnerText}
          </h2>
        </div>
      </div>

      {gameState.wordPair && (
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl">
              <Key className="h-6 w-6 text-primary" />
              {t('wordPairUsed')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-2xl lg:text-3xl font-bold">
                {gameState.wordPair[0]} - {gameState.wordPair[1]}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl">
            <Users className="h-6 w-6 text-primary" />
            {t('playerRoles')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            {gameState.players.map((player) => (
              <RoleCard key={player.id} player={player} wordPair={gameState.wordPair} />
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center pt-4">
        <Button onClick={handlePlayAgain} size="lg" variant="outline" className="w-full sm:w-auto">
          <RotateCcw className="h-5 w-5 mr-2" />
          {t('common:buttons.playAgain')}
        </Button>
        <Button onClick={handleNewGroup} size="lg" className="w-full sm:w-auto">
          <Users className="h-5 w-5 mr-2" />
          {t('common:buttons.newGroup')}
        </Button>
      </div>
    </div>
  );
};
