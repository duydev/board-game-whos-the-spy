import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';
import { PlayerCard } from '@/components/PlayerCard';
import { VoteResult } from '@/components/VoteResult';
import { getVoteResults, getPlayerWithMostVotes } from '@/utils/gameLogic';

export const Voting = () => {
  const navigate = useNavigate();
  const { gameState, submitVote, finishVoting } = useGame();
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [currentVoterId, setCurrentVoterId] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (!gameState) {
      navigate('/');
      return;
    }

    const activePlayers = gameState.players.filter((p) => !p.isEliminated);

    // Find first player who hasn't voted
    const firstNonVoter = activePlayers.find((p) => !gameState.votes[p.id]);
    if (firstNonVoter) {
      setCurrentVoterId(firstNonVoter.id);
      setSelectedPlayerId(null);
    } else {
      // All players have voted
      setShowResults(true);
    }
  }, [gameState, navigate]);

  if (!gameState) return null;

  const activePlayers = gameState.players.filter((p) => !p.isEliminated);
  const currentVoter = activePlayers.find((p) => p.id === currentVoterId);
  const votersRemaining = activePlayers.filter((p) => !gameState.votes[p.id]).length;

  const handleVote = () => {
    if (!selectedPlayerId || !currentVoterId) return;
    if (selectedPlayerId === currentVoterId) {
      alert('Bạn không thể vote cho chính mình!');
      return;
    }

    submitVote(currentVoterId, selectedPlayerId);
    setSelectedPlayerId(null);

    // Check if all have voted
    const updatedVotes = { ...gameState.votes, [currentVoterId]: selectedPlayerId };
    const allVoted = activePlayers.every((player) => updatedVotes[player.id]);

    if (allVoted) {
      setTimeout(() => {
        setShowResults(true);
      }, 500);
    } else {
      // Move to next voter
      const nextVoter = activePlayers.find((p) => !updatedVotes[p.id]);
      if (nextVoter) {
        setCurrentVoterId(nextVoter.id);
      }
    }
  };

  const handleFinishVoting = () => {
    finishVoting();

    // Check game state after elimination
    const eliminatedPlayerId = getPlayerWithMostVotes(gameState);
    if (eliminatedPlayerId) {
      // Simulate elimination to check if game is over
      const testPlayers = gameState.players.map((p) =>
        p.id === eliminatedPlayerId ? { ...p, isEliminated: true } : p
      );
      const activeSpies = testPlayers.filter((p) => !p.isEliminated && p.role === 'spy').length;
      const activeCivilians = testPlayers.filter(
        (p) => !p.isEliminated && p.role === 'civilian'
      ).length;

      // Navigate based on win condition
      setTimeout(() => {
        if (activeSpies === 0 || activeSpies >= activeCivilians) {
          navigate('/result');
        } else {
          navigate('/discussion');
        }
      }, 1500);
    }
  };

  if (showResults) {
    const voteResults = getVoteResults(gameState);
    const eliminatedPlayerId = getPlayerWithMostVotes(gameState);

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Kết quả bỏ phiếu</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {voteResults.map((result) => (
            <VoteResult
              key={result.playerId}
              playerName={result.playerName}
              voteCount={result.voteCount}
              isEliminated={result.playerId === eliminatedPlayerId}
            />
          ))}
        </div>

        {eliminatedPlayerId && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive text-center">
                {gameState.players.find((p) => p.id === eliminatedPlayerId)?.name} đã bị loại!
              </CardTitle>
            </CardHeader>
          </Card>
        )}

        <div className="flex justify-center">
          <Button onClick={handleFinishVoting} size="lg">
            Tiếp tục
          </Button>
        </div>
      </div>
    );
  }

  if (!currentVoter) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Bỏ phiếu</h1>
        </div>
        <Card>
          <CardContent className="py-8 text-center">
            <p>Đang tính toán kết quả...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const votablePlayers = activePlayers.filter((p) => p.id !== currentVoter.id);
  const hasVoted = !!gameState.votes[currentVoter.id];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Bỏ phiếu</h1>
        <p className="text-muted-foreground">
          {hasVoted
            ? 'Bạn đã bỏ phiếu. Đợi người khác...'
            : `Lượt của: ${currentVoter.name} (Còn ${votersRemaining} người chưa vote)`}
        </p>
      </div>

      {!hasVoted && (
        <Card>
          <CardHeader>
            <CardTitle>Chọn người bạn nghi ngờ là gián điệp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {votablePlayers.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  isCurrent={selectedPlayerId === player.id}
                  onClick={() => setSelectedPlayerId(player.id)}
                />
              ))}
            </div>
            <div className="mt-6 flex justify-center">
              <Button onClick={handleVote} disabled={!selectedPlayerId} size="lg">
                Xác nhận bỏ phiếu
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {hasVoted && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-lg">Đã ghi nhận phiếu bầu của bạn.</p>
            <p className="text-muted-foreground">Vui lòng đợi các người chơi khác...</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
