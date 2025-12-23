import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t } = useTranslation('components/layout');
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/">
              <h1 className="text-2xl font-bold">{t('appTitle')}</h1>
            </Link>
            <nav className="flex gap-2">
              {location.pathname !== '/' && (
                <Button variant="ghost" asChild>
                  <Link to="/">{t('home')}</Link>
                </Button>
              )}
              <Button variant="ghost" asChild>
                <Link to="/rules">{t('rules')}</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
};
