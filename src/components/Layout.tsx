import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, BookOpen, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t } = useTranslation('components/layout');
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {/* Subtle background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-primary/5 dark:to-primary/10 pointer-events-none -z-10" />

      <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-5">
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 hover:opacity-80 transition-all duration-200 hover:scale-105"
            >
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {t('appTitle')}
              </h1>
            </Link>
            <nav className="flex items-center gap-2">
              {location.pathname !== '/' && (
                <Button variant="ghost" size="sm" className="h-9 md:h-10 px-3 md:px-4" asChild>
                  <Link to="/" className="flex items-center gap-2">
                    <Home className="h-4 w-4 md:h-5 md:w-5" />
                    <span className="hidden sm:inline">{t('home')}</span>
                  </Link>
                </Button>
              )}
              <Button variant="ghost" size="sm" className="h-9 md:h-10 px-3 md:px-4" asChild>
                <Link to="/rules" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="hidden sm:inline">{t('rules')}</span>
                </Link>
              </Button>
              <ThemeToggle />
            </nav>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 flex-1">
        {children}
      </main>
      <footer className="border-t mt-auto bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="flex flex-wrap items-center justify-center gap-2 lg:gap-3 text-sm lg:text-base text-muted-foreground">
            <span>{t('footer.madeWith')}</span>
            <Heart className="h-4 w-4 lg:h-5 lg:w-5 text-red-500 fill-red-500 animate-pulse" />
            <span>{t('footer.by')}</span>
            <a
              href="https://duydev.io.vn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium transition-all duration-200 hover:text-primary/80"
            >
              {t('footer.authorName')}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
