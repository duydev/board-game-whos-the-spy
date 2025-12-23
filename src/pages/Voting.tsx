import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckSquare, UserCheck, CheckCircle, BarChart, Loader2 } from 'lucide-react';
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
      <div className="max-w-4xl mx-auto space-y-8 lg:space-y-12">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <BarChart className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 text-primary animate-pulse" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {t('votingResults')}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
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
          <Card className="border-2 border-destructive shadow-lg">
            <CardHeader>
              <CardTitle className="text-destructive text-center text-xl lg:text-2xl">
                {t('eliminated', {
                  name: gameState.players.find((p) => p.id === eliminatedPlayerId)?.name,
                })}
              </CardTitle>
            </CardHeader>
          </Card>
        )}

        <div className="flex justify-center pt-4">
          <Button onClick={handleFinishVoting} size="lg" className="w-full sm:w-auto">
            {t('common:buttons.continue')}
            <CheckCircle className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  if (!currentVoter) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 lg:space-y-12">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <CheckSquare className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 text-primary animate-pulse" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {t('title')}
            </h1>
          </div>
        </div>
        <Card className="shadow-lg">
          <CardContent className="py-12 text-center">
            <Loader2 className="h-12 w-12 lg:h-16 lg:w-16 animate-spin mx-auto mb-6 text-primary" />
            <p className="text-base lg:text-lg">{t('calculating')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const votablePlayers = activePlayers.filter((p) => p.id !== currentVoter.id);
  const hasVoted = !!gameState.votes[currentVoter.id];

  return (
    <div className="max-w-4xl mx-auto space-y-8 lg:space-y-12">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <CheckSquare className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 text-primary animate-pulse" />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {t('title')}
          </h1>
        </div>
        <p className="text-base lg:text-lg text-muted-foreground">
          {hasVoted ? (
            <span className="flex items-center justify-center gap-2">
              <CheckCircle className="h-5 w-5" />
              {t('alreadyVoted')}
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <UserCheck className="h-5 w-5" />
              {t('yourTurn', { name: currentVoter.name, remaining: votersRemaining })}
            </span>
          )}
        </p>
      </div>

      {!hasVoted && (
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl">
              <UserCheck className="h-6 w-6 text-primary" />
              {t('selectSuspect')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {votablePlayers.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  isCurrent={selectedPlayerId === player.id}
                  onClick={() => setSelectedPlayerId(player.id)}
                />
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <Button
                onClick={handleVote}
                disabled={!selectedPlayerId}
                size="lg"
                className="w-full sm:w-auto"
              >
                {t('common:buttons.confirmVote')}
                <CheckCircle className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {hasVoted && (
        <Card className="shadow-lg">
          <CardContent className="py-12 text-center">
            <CheckCircle className="h-16 w-16 lg:h-20 lg:w-20 text-primary mx-auto mb-6" />
            <p className="text-xl lg:text-2xl font-semibold mb-4">{t('voteRecorded')}</p>
            <p className="text-base lg:text-lg text-muted-foreground">{t('waitingOthers')}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
