import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGame } from '@/presentation/contexts/GameContext';
import { PlayerCard } from '@/components/PlayerCard';
import { VoteResult } from '@/components/VoteResult';

export const Voting = () => {
  const { t } = useTranslation(['pages/voting', 'errors', 'common']);
  const navigate = useNavigate();
  const { gameState, submitVote, finishVoting, getVoteResults, getPlayerWithMostVotes } = useGame();
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
      setShowResults(false);
    } else if (activePlayers.length > 0) {
      // All players have voted
      setShowResults(true);
    }
  }, [gameState, navigate]);

  // Navigate based on game state changes after finishing voting
  useEffect(() => {
    if (!gameState || !showResults) return;

    if (gameState.isGameOver) {
      const timeout = setTimeout(() => {
        navigate('/result');
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [gameState, showResults, navigate]);

  if (!gameState) return null;

  const activePlayers = gameState.players.filter((p) => !p.isEliminated);
  const currentVoter = activePlayers.find((p) => p.id === currentVoterId);
  const votersRemaining = activePlayers.filter((p) => !gameState.votes[p.id]).length;

  const handleVote = async () => {
    if (!selectedPlayerId || !currentVoterId || !gameState) return;
    if (selectedPlayerId === currentVoterId) {
      alert(t('errors:cannotVoteSelf'));
      return;
    }

    try {
      await submitVote(currentVoterId, selectedPlayerId);
      setSelectedPlayerId(null);
    } catch (error) {
      console.error('Failed to submit vote:', error);
      return;
    }

    // Check if all have voted - need to check updated state
    // This will be handled by useEffect when gameState updates
  };

  const handleFinishVoting = async () => {
    if (!gameState) return;

    try {
      await finishVoting();
      // State will update automatically via context
      // Navigation will happen in useEffect when isGameOver changes
    } catch (error) {
      console.error('Failed to finish voting:', error);
    }
  };

  if (showResults && gameState) {
    const voteResults = getVoteResults(gameState);
    const eliminatedPlayerId = getPlayerWithMostVotes(gameState);

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">{t('votingResults')}</h1>
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
                {t('eliminated', {
                  name: gameState.players.find((p) => p.id === eliminatedPlayerId)?.name,
                })}
              </CardTitle>
            </CardHeader>
          </Card>
        )}

        <div className="flex justify-center">
          <Button onClick={handleFinishVoting} size="lg">
            {t('common:buttons.continue')}
          </Button>
        </div>
      </div>
    );
  }

  if (!currentVoter) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
        </div>
        <Card>
          <CardContent className="py-8 text-center">
            <p>{t('calculating')}</p>
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
        <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
        <p className="text-muted-foreground">
          {hasVoted
            ? t('alreadyVoted')
            : t('yourTurn', { name: currentVoter.name, remaining: votersRemaining })}
        </p>
      </div>

      {!hasVoted && (
        <Card>
          <CardHeader>
            <CardTitle>{t('selectSuspect')}</CardTitle>
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
                {t('common:buttons.confirmVote')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {hasVoted && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-lg">{t('voteRecorded')}</p>
            <p className="text-muted-foreground">{t('waitingOthers')}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
