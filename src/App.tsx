import { useState } from 'react';
import GameSetup from './components/GameSetup';
import PlayRound from './components/PlayRound';
import type { GameRoundReport } from './types';
import RoundReport from './components/RoundReport';

//type GameMode = "single" | "multi";

//type GameSettings = {
  //mode: GameMode;
//};

function App() {
  const [playing, setPlaying] = useState<boolean>(false);
  const [gameRoundScore, setGameRoundScore] = useState<GameRoundReport | null>(null);

  const handleGameRoundEnd = (report: {finalScore: number}) => {
    setGameRoundScore(report);
    setPlaying(false);
  }

  const handleGoHome = () => {
    setGameRoundScore(null);  // reset game round report
  };

  return (
    <div className='flex flex-col gap-2 h-screen w-screen items-center justify-center p-2'>
      {!playing ? (
        gameRoundScore ? (
          <RoundReport report={gameRoundScore} onGoHome={handleGoHome} />
        ) : (
          <GameSetup onStart={() => setPlaying(true)} />
        )
      ) : (
        <PlayRound mode="single" onRoundEnd={handleGameRoundEnd} />
      )}
    </div>
  );
}

export default App;
