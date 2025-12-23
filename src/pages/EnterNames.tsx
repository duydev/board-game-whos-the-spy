import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserPlus, User, ArrowLeft, Play } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGame } from '@/presentation/contexts/GameContext';
import type { GameConfig } from '@/domain/entities/GameConfig';

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

  const handleStart = async () => {
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
    try {
      await startGame(config, trimmedNames);
      navigate('/view-role');
    } catch (error) {
      console.error('Failed to start game:', error);
      alert(t('errors:failedToStartGame'));
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8 md:space-y-10">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <UserPlus className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-primary" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">{t('title')}</h1>
        </div>
        <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
          {t('subtitle', { count: totalPlayers })}
        </p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            {t('playerList.title')}
          </CardTitle>
          <CardDescription>{t('playerList.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-5 md:space-y-6">
          {playerNames.map((name, index) => (
            <div key={index} className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                {t('playerLabel', { index: index + 1 })}
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                placeholder={t('placeholder', { index: index + 1 })}
                className="w-full min-h-[44px] text-base md:text-lg"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 md:gap-6 justify-end">
        <Button
          variant="outline"
          onClick={() => navigate('/')}
          className="w-full sm:w-auto min-h-[44px] text-base md:text-lg"
        >
          <ArrowLeft className="h-4 w-4 md:h-5 md:w-5 mr-2" />
          {t('common:buttons.back')}
        </Button>
        <Button
          onClick={handleStart}
          className="w-full sm:w-auto min-h-[44px] text-base md:text-lg"
        >
          {t('common:buttons.start')}
          <Play className="h-4 w-4 md:h-5 md:w-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};
