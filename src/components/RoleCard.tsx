import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Player } from '@/types/game';

interface RoleCardProps {
  player: Player;
  wordPair: [string, string] | null;
}

export const RoleCard: React.FC<RoleCardProps> = ({ player, wordPair }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{player.name}</span>
          <Badge variant={player.role === 'spy' ? 'destructive' : 'default'}>
            {player.role === 'spy' ? 'Gián điệp' : 'Dân thường'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {player.role === 'spy' ? (
            <div>
              <p className="text-sm text-muted-foreground">Bạn là gián điệp!</p>
              <p className="text-lg font-semibold mt-2">Bạn không biết từ khóa</p>
              {wordPair && (
                <div className="mt-4 p-3 bg-muted rounded-md">
                  <p className="text-sm text-muted-foreground">Cặp từ trong game:</p>
                  <p className="font-semibold">
                    {wordPair[0]} - {wordPair[1]}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <p className="text-sm text-muted-foreground">Từ khóa của bạn:</p>
              <p className="text-2xl font-bold mt-2">{player.word}</p>
              {wordPair && (
                <div className="mt-4 p-3 bg-muted rounded-md">
                  <p className="text-sm text-muted-foreground">Cặp từ trong game:</p>
                  <p className="font-semibold">
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
