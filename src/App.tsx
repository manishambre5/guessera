import { useState } from 'react';
import GameSetup from './components/common/GameSetup';
import PlayRound from './components/common/PlayRound';
import type { GameRoundReport, GameSettings, MultiPlayerAction } from './types';
import RoundReport from './components/common/RoundReport';
import CreateParty from './components/multiplayer/CreateParty';
import JoinParty from './components/multiplayer/JoinParty';


function App() {
  const [playing, setPlaying] = useState<boolean>(false);
  const [partying, setPartying] = useState<boolean>(false);
  const [multiplayerAction, setMultiplayerAction] = useState<MultiPlayerAction>();
  const [gameRoundScore, setGameRoundScore] = useState<GameRoundReport | null>(null);
  const [gameSettings, setGameSettings] = useState<GameSettings>();

  const handleGameRoundEnd = (report: {finalScore: number}) => {
    setGameRoundScore(report);
    setPlaying(false);
  }

  const handleGoHome = () => {
    setGameRoundScore(null);  // reset game round report state
    setPartying(false);
  };


  return (
    <div className="relative h-screen overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center blur-pxs bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Ashurbanipal_in_a_chariot%2C_wall_relief%2C_7th_century_BC%2C_from_Nineveh%2C_the_British_Museum.jpg/3840px-Ashurbanipal_in_a_chariot%2C_wall_relief%2C_7th_century_BC%2C_from_Nineveh%2C_the_British_Museum.jpg')]" />

      <div className="absolute inset-0 bg-black/50" />

      <div className='flex flex-col gap-2 h-screen w-screen items-center justify-center p-2 relative z-10'>
        {!playing ? (
          gameRoundScore ? (
            <RoundReport
              report={gameRoundScore}
              onGoHome={handleGoHome}
            />
          ) : (
            ! partying ? (
              <GameSetup
                onStart={() => setPlaying(true)}
                onMultiplayerMode={(value: MultiPlayerAction) => {
                  setPartying(true);
                  setMultiplayerAction(value);
                }}
                onSetGameSettings={setGameSettings}
              />              
            ) : multiplayerAction === "create" ? (
              <CreateParty onGoHome={handleGoHome} />
            ) : (
              <JoinParty onGoHome={handleGoHome} />
            )
          )
        ) : (
          <PlayRound
            onRoundEnd={handleGameRoundEnd}
            gameSettings={gameSettings}
          />
        )}
      </div>
    </div>
  );
}

export default App;
