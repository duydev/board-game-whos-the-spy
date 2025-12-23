import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const ThemeToggle = () => {
  const { t } = useTranslation('components/layout');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const applyTheme = (newTheme: 'light' | 'dark') => {
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  useEffect(() => {
    // Check localStorage and system preference
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    const initialTheme = storedTheme || systemTheme;

    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={cn('h-9 w-9')}
      aria-label={
        theme === 'light' ? t('themeToggle.switchToDark') : t('themeToggle.switchToLight')
      }
    >
      {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </Button>
  );
};
