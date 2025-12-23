import { useTranslation } from 'react-i18next';
import { CheckCircle, XCircle } from 'lucide-react';
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
    <Card
      className={`shadow-lg hover:shadow-xl transition-all duration-200 ${isEliminated ? 'ring-2 ring-destructive border-2 border-destructive' : ''}`}
    >
      <CardHeader className="p-6 lg:p-8">
        <CardTitle className="flex items-center justify-between gap-3 text-lg lg:text-xl">
          <span className="truncate font-semibold">{playerName}</span>
          <Badge
            variant={isEliminated ? 'destructive' : 'secondary'}
            className="flex items-center gap-1 text-sm"
          >
            <CheckCircle className="h-4 w-4" />
            {voteCount} {voteCount !== 1 ? t('votes') : t('vote')}
          </Badge>
        </CardTitle>
      </CardHeader>
      {isEliminated && (
        <CardContent className="p-6 lg:p-8 pt-0">
          <Badge
            variant="destructive"
            className="w-full justify-center flex items-center gap-2 text-sm py-2"
          >
            <XCircle className="h-4 w-4" />
            {t('eliminated')}
          </Badge>
        </CardContent>
      )}
    </Card>
  );
};
