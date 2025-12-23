import { useTranslation } from 'react-i18next';
import { UserCheck, UserX, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Player } from '@/domain/entities/Player';

interface PlayerCardProps {
  player: Player;
  isCurrent?: boolean;
  showRole?: boolean;
  showWord?: boolean;
  onClick?: () => void;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  isCurrent = false,
  showRole = false,
  showWord = false,
  onClick,
}) => {
  const { t } = useTranslation('components/playerCard');

  const getRoleBadge = () => {
    if (!showRole) return null;

    if (player.role === 'spy') {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <UserX className="h-3 w-3" />
          {t('spy')}
        </Badge>
      );
    }
    return (
      <Badge variant="default" className="flex items-center gap-1">
        <UserCheck className="h-3 w-3" />
        {t('civilian')}
      </Badge>
    );
  };

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 ${
        isCurrent ? 'ring-2 ring-primary ring-offset-2 shadow-xl scale-105' : 'shadow-lg'
      } ${player.isEliminated ? 'opacity-50' : ''} ${onClick ? 'hover:shadow-xl hover:scale-105 active:scale-100' : 'hover:shadow-xl'}`}
      onClick={onClick}
    >
      <CardHeader className="p-6 lg:p-8">
        <CardTitle className="flex items-center justify-between gap-3 text-lg lg:text-xl">
          <span className="truncate font-semibold">{player.name}</span>
          {getRoleBadge()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6 lg:p-8 pt-0">
        {showWord && (
          <div>
            <p className="text-sm lg:text-base text-muted-foreground mb-2">{t('keyword')}</p>
            <p className="text-lg lg:text-xl font-semibold">{player.word || '?'}</p>
          </div>
        )}
        {player.isEliminated && (
          <Badge variant="outline" className="flex items-center gap-1 w-fit">
            <XCircle className="h-3 w-3" />
            {t('eliminated')}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};
