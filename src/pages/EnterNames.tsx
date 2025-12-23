import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGame } from '@/contexts/GameContext';
import type { GameConfig } from '@/types/game';

export const EnterNames = () => {
  const navigate = useNavigate();
  const { startGame } = useGame();
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [totalPlayers, setTotalPlayers] = useState<number>(4);

  useEffect(() => {
    const configStr = localStorage.getItem('game-config');
    if (!configStr) {
      navigate('/');
      return;
    }

    const config: GameConfig = JSON.parse(configStr);
    setTotalPlayers(config.totalPlayers);
    setPlayerNames(new Array(config.totalPlayers).fill(''));
  }, [navigate]);

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...playerNames];
    newNames[index] = value;
    setPlayerNames(newNames);
  };

  const handleStart = () => {
    // Validate names
    const trimmedNames = playerNames.map((name) => name.trim());

    if (trimmedNames.some((name) => name === '')) {
      alert('Vui lòng nhập đầy đủ tên cho tất cả người chơi!');
      return;
    }

    // Check for duplicate names
    const uniqueNames = new Set(trimmedNames);
    if (uniqueNames.size !== trimmedNames.length) {
      alert('Tên người chơi không được trùng nhau!');
      return;
    }

    const configStr = localStorage.getItem('game-config');
    if (!configStr) {
      navigate('/');
      return;
    }

    const config: GameConfig = JSON.parse(configStr);
    startGame(config, trimmedNames);
    navigate('/discussion');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Nhập tên người chơi</h1>
        <p className="text-muted-foreground">Nhập tên cho {totalPlayers} người chơi</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách người chơi</CardTitle>
          <CardDescription>Nhập tên cho từng người chơi</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {playerNames.map((name, index) => (
            <div key={index} className="space-y-2">
              <label className="text-sm font-medium">Người chơi {index + 1}</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                placeholder={`Nhập tên người chơi ${index + 1}`}
                className="w-full"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-4 justify-end">
        <Button variant="outline" onClick={() => navigate('/')}>
          Quay lại
        </Button>
        <Button onClick={handleStart}>Bắt đầu game</Button>
      </div>
    </div>
  );
};
