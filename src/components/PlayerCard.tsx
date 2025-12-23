import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Player } from '@/types/game';

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
      return <Badge variant="destructive">{t('spy')}</Badge>;
    }
    return <Badge variant="default">{t('civilian')}</Badge>;
  };

  return (
    <Card
      className={`cursor-pointer transition-all ${
        isCurrent ? 'ring-2 ring-primary' : ''
      } ${player.isEliminated ? 'opacity-50' : ''} ${onClick ? 'hover:shadow-md' : ''}`}
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{player.name}</span>
          {getRoleBadge()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showWord && (
          <div className="mt-2">
            <p className="text-sm text-muted-foreground">{t('keyword')}</p>
            <p className="text-lg font-semibold">{player.word || '?'}</p>
          </div>
        )}
        {player.isEliminated && (
          <Badge variant="outline" className="mt-2">
            {t('eliminated')}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};
