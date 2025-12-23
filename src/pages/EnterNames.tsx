import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGame } from '@/contexts/GameContext';
import type { GameConfig } from '@/types/game';

export const EnterNames = () => {
  const { t } = useTranslation(['pages/enterNames', 'errors', 'common']);
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
      alert(t('errors:emptyPlayerNames'));
      return;
    }

    // Check for duplicate names
    const uniqueNames = new Set(trimmedNames);
    if (uniqueNames.size !== trimmedNames.length) {
      alert(t('errors:duplicatePlayerNames'));
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
        <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
        <p className="text-muted-foreground">{t('subtitle', { count: totalPlayers })}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('playerList.title')}</CardTitle>
          <CardDescription>{t('playerList.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {playerNames.map((name, index) => (
            <div key={index} className="space-y-2">
              <label className="text-sm font-medium">
                {t('playerLabel', { index: index + 1 })}
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                placeholder={t('placeholder', { index: index + 1 })}
                className="w-full"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-4 justify-end">
        <Button variant="outline" onClick={() => navigate('/')}>
          {t('common:buttons.back')}
        </Button>
        <Button onClick={handleStart}>{t('common:buttons.start')}</Button>
      </div>
    </div>
  );
};
