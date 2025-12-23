import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';
import { RoleCard } from '@/components/RoleCard';

export const GameResult = () => {
  const navigate = useNavigate();
  const { gameState, resetGame } = useGame();

  if (!gameState) {
    navigate('/');
    return null;
  }

  const handlePlayAgain = () => {
    // Keep same players, reset game
    resetGame();
    navigate('/enter-names');
  };

  const handleNewGroup = () => {
    resetGame();
    navigate('/');
  };

  const winnerText = gameState.winner === 'civilians' ? 'Dân thường thắng!' : 'Gián điệp thắng!';
  const winnerColor = gameState.winner === 'civilians' ? 'text-green-600' : 'text-red-600';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Kết quả game</h1>
        <h2 className={`text-3xl font-bold ${winnerColor} mt-4`}>{winnerText}</h2>
      </div>

      {gameState.wordPair && (
        <Card>
          <CardHeader>
            <CardTitle>Cặp từ khóa đã sử dụng</CardTitle>
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
          <CardTitle>Vai trò của từng người chơi</CardTitle>
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
          Chơi lại
        </Button>
        <Button onClick={handleNewGroup} size="lg">
          Tạo nhóm mới
        </Button>
      </div>
    </div>
  );
};
