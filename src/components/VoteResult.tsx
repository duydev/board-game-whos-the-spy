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
  return (
    <Card className={`${isEliminated ? 'ring-2 ring-destructive' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{playerName}</span>
          <Badge variant={isEliminated ? 'destructive' : 'secondary'}>
            {voteCount} vote{voteCount !== 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      {isEliminated && (
        <CardContent>
          <Badge variant="destructive" className="w-full justify-center">
            Bị loại
          </Badge>
        </CardContent>
      )}
    </Card>
  );
};
