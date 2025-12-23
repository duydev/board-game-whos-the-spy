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
    <div className="max-w-2xl mx-auto space-y-8 lg:space-y-12">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <UserPlus className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 text-primary animate-pulse" />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {t('title')}
          </h1>
        </div>
        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground">
          {t('subtitle', { count: totalPlayers })}
        </p>
      </div>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl">
            <User className="h-6 w-6 text-primary" />
            {t('playerList.title')}
          </CardTitle>
          <CardDescription className="text-base">{t('playerList.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {playerNames.map((name, index) => (
            <div key={index} className="space-y-2">
              <label className="text-base font-medium flex items-center gap-2">
                <User className="h-5 w-5 text-muted-foreground" />
                {t('playerLabel', { index: index + 1 })}
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                placeholder={t('placeholder', { index: index + 1 })}
                className="w-full h-12 text-lg"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-end pt-4">
        <Button
          variant="outline"
          onClick={() => navigate('/')}
          size="lg"
          className="w-full sm:w-auto"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          {t('common:buttons.back')}
        </Button>
        <Button onClick={handleStart} size="lg" className="w-full sm:w-auto">
          {t('common:buttons.start')}
          <Play className="h-5 w-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};
