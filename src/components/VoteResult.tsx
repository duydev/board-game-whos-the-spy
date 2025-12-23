import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface VoteResultProps {
  playerName: string;
  voteCount: number;
  isEliminated?: boolean;
}

export const VoteResult: React.FC<VoteResultProps> = ({
  playerName,
  voteCount,
  isEliminated = false,
}) => {
  const { t } = useTranslation('components/voteResult');

  return (
    <Card className={`${isEliminated ? 'ring-2 ring-destructive' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{playerName}</span>
          <Badge variant={isEliminated ? 'destructive' : 'secondary'}>
            {voteCount} {voteCount !== 1 ? t('votes') : t('vote')}
          </Badge>
        </CardTitle>
      </CardHeader>
      {isEliminated && (
        <CardContent>
          <Badge variant="destructive" className="w-full justify-center">
            {t('eliminated')}
          </Badge>
        </CardContent>
      )}
    </Card>
  );
};
