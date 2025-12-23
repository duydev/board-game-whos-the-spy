import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/">
              <h1 className="text-2xl font-bold">Ai là gián điệp?</h1>
            </Link>
            <nav className="flex gap-2">
              {location.pathname !== '/' && (
                <Button variant="ghost" asChild>
                  <Link to="/">Trang chủ</Link>
                </Button>
              )}
              <Button variant="ghost" asChild>
                <Link to="/rules">Luật chơi</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
};
