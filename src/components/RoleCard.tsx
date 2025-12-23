import { useTranslation } from 'react-i18next';
import { Key, EyeOff, UserCheck, UserX } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Player } from '@/domain/entities/Player';

interface RoleCardProps {
  player: Player;
  wordPair: [string, string] | null;
}

export const RoleCard: React.FC<RoleCardProps> = ({ player, wordPair }) => {
  const { t } = useTranslation('components/roleCard');

  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-6 lg:p-8">
        <CardTitle className="flex items-center justify-between gap-3 text-lg lg:text-xl">
          <span className="truncate font-semibold">{player.name}</span>
          <Badge
            variant={player.role === 'spy' ? 'destructive' : 'default'}
            className="flex items-center gap-1 text-sm"
          >
            {player.role === 'spy' ? (
              <>
                <UserX className="h-4 w-4" />
                {t('spy')}
              </>
            ) : (
              <>
                <UserCheck className="h-4 w-4" />
                {t('civilian')}
              </>
            )}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 lg:p-8 pt-0">
        <div className="space-y-6">
          {player.role === 'spy' ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <EyeOff className="h-5 w-5 lg:h-6 lg:w-6 text-destructive" />
                <p className="text-base lg:text-lg text-muted-foreground">{t('youAreSpy')}</p>
              </div>
              <p className="text-lg lg:text-xl font-semibold">{t('youDontKnowKeyword')}</p>
              {wordPair && (
                <div className="mt-6 p-4 lg:p-6 bg-muted rounded-lg border-2">
                  <div className="flex items-center gap-2 mb-3">
                    <Key className="h-5 w-5 text-muted-foreground" />
                    <p className="text-sm lg:text-base text-muted-foreground">
                      {t('wordPairInGame')}
                    </p>
                  </div>
                  <p className="font-semibold text-base lg:text-lg">
                    {wordPair[0]} - {wordPair[1]}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Key className="h-5 w-5 lg:h-6 lg:w-6 text-primary" />
                <p className="text-base lg:text-lg text-muted-foreground">{t('yourKeyword')}</p>
              </div>
              <p className="text-3xl lg:text-4xl font-bold text-primary animate-pulse">
                {player.word}
              </p>
              {wordPair && (
                <div className="mt-6 p-4 lg:p-6 bg-muted rounded-lg border-2">
                  <div className="flex items-center gap-2 mb-3">
                    <Key className="h-5 w-5 text-muted-foreground" />
                    <p className="text-sm lg:text-base text-muted-foreground">
                      {t('wordPairInGame')}
                    </p>
                  </div>
                  <p className="font-semibold text-base lg:text-lg">
                    {wordPair[0]} - {wordPair[1]}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
