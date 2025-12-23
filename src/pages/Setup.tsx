import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getAvailableCategories } from '@/utils/gameLogic';

export const Setup = () => {
  const { t } = useTranslation(['pages/setup', 'errors', 'common']);
  const navigate = useNavigate();
  const [totalPlayers, setTotalPlayers] = useState<number>(4);
  const [numberOfSpies, setNumberOfSpies] = useState<number>(1);
  const [category, setCategory] = useState<string>('random');

  const availableCategories = getAvailableCategories();

  const handleNext = () => {
    if (numberOfSpies >= totalPlayers) {
      alert(t('errors:spiesMustBeLessThanPlayers'));
      return;
    }

    // Save config to navigate to enter names
    const config = {
      totalPlayers,
      numberOfSpies,
      category: category as string | 'random',
    };
    localStorage.setItem('game-config', JSON.stringify(config));
    navigate('/enter-names');
  };

  const maxSpies = Math.floor(totalPlayers / 2);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
        <p className="text-muted-foreground">{t('subtitle')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('totalPlayers.title')}</CardTitle>
          <CardDescription>{t('totalPlayers.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Input
              type="number"
              min="3"
              max="10"
              value={totalPlayers}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 3;
                const clamped = Math.min(10, Math.max(3, value));
                setTotalPlayers(clamped);
                if (numberOfSpies >= clamped) {
                  setNumberOfSpies(Math.max(1, Math.floor(clamped / 2)));
                }
              }}
              className="w-32"
            />
            <div className="flex-1">
              <input
                type="range"
                min="3"
                max="10"
                value={totalPlayers}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setTotalPlayers(value);
                  if (numberOfSpies >= value) {
                    setNumberOfSpies(Math.max(1, Math.floor(value / 2)));
                  }
                }}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('numberOfSpies.title')}</CardTitle>
          <CardDescription>{t('numberOfSpies.description', { maxSpies })}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Input
              type="number"
              min="1"
              max={maxSpies}
              value={numberOfSpies}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 1;
                const clamped = Math.min(maxSpies, Math.max(1, value));
                setNumberOfSpies(clamped);
              }}
              className="w-32"
            />
            <div className="flex-1">
              <input
                type="range"
                min="1"
                max={maxSpies}
                value={numberOfSpies}
                onChange={(e) => setNumberOfSpies(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
          {numberOfSpies >= totalPlayers && (
            <p className="text-destructive text-sm mt-2">{t('numberOfSpies.error')}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('category.title')}</CardTitle>
          <CardDescription>{t('category.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder={t('category.placeholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="random">{t('category.random')}</SelectItem>
              {availableCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="flex gap-4 justify-end">
        <Button variant="outline" onClick={() => navigate('/rules')}>
          {t('common:buttons.viewRules')}
        </Button>
        <Button onClick={handleNext} disabled={numberOfSpies >= totalPlayers}>
          {t('common:buttons.next')}
        </Button>
      </div>
    </div>
  );
};
