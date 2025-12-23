import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Users, UserX, FolderTree, ArrowRight, BookOpen } from 'lucide-react';
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
import { CategoryRepository } from '@/infrastructure/repositories/CategoryRepository';

export const Setup = () => {
  const { t } = useTranslation(['pages/setup', 'errors', 'common']);
  const navigate = useNavigate();
  const [totalPlayers, setTotalPlayers] = useState<number>(4);
  const [numberOfSpies, setNumberOfSpies] = useState<number>(1);
  const [category, setCategory] = useState<string>('random');
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      const repo = new CategoryRepository();
      const categories = await repo.getAvailableCategories();
      setAvailableCategories(categories);
    };
    loadCategories();
  }, []);

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
    <div className="max-w-2xl mx-auto space-y-8 lg:space-y-12">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Users className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 text-primary animate-pulse" />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {t('title')}
          </h1>
        </div>
        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground">{t('subtitle')}</p>
      </div>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl">
            <Users className="h-6 w-6 text-primary" />
            {t('totalPlayers.title')}
          </CardTitle>
          <CardDescription className="text-base">{t('totalPlayers.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6">
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
              className="w-full sm:w-32 lg:w-40 h-12 text-lg"
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
                className="w-full h-3 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary touch-manipulation transition-all"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl">
            <UserX className="h-6 w-6 text-destructive" />
            {t('numberOfSpies.title')}
          </CardTitle>
          <CardDescription className="text-base">
            {t('numberOfSpies.description', { maxSpies })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6">
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
              className="w-full sm:w-32 lg:w-40 h-12 text-lg"
            />
            <div className="flex-1">
              <input
                type="range"
                min="1"
                max={maxSpies}
                value={numberOfSpies}
                onChange={(e) => setNumberOfSpies(parseInt(e.target.value))}
                className="w-full h-3 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary touch-manipulation transition-all"
              />
            </div>
          </div>
          {numberOfSpies >= totalPlayers && (
            <p className="text-destructive text-sm mt-4 font-medium">{t('numberOfSpies.error')}</p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl">
            <FolderTree className="h-6 w-6 text-primary" />
            {t('category.title')}
          </CardTitle>
          <CardDescription className="text-base">{t('category.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-12 text-base">
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

      <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-end pt-4">
        <Button
          variant="outline"
          onClick={() => navigate('/rules')}
          size="lg"
          className="w-full sm:w-auto"
        >
          <BookOpen className="h-5 w-5 mr-2" />
          {t('common:buttons.viewRules')}
        </Button>
        <Button
          onClick={handleNext}
          disabled={numberOfSpies >= totalPlayers}
          size="lg"
          className="w-full sm:w-auto"
        >
          {t('common:buttons.next')}
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};
