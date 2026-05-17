import { useState } from 'react';
import GameSetup from './components/common/GameSetup';
import PlayRound from './components/common/PlayRound';
import type { GameRoundReport, GameSettings, MultiPlayerAction, PartySettings, Player } from './types';
import RoundReport from './components/common/RoundReport';
import CreateParty from './components/multiplayer/CreateParty';
import JoinParty from './components/multiplayer/JoinParty';
import Party from './components/multiplayer/Party';


function App() {
  const [playing, setPlaying] = useState<boolean>(false);
  const [partying, setPartying] = useState<boolean>(false);
  const [multiplayerAction, setMultiplayerAction] = useState<MultiPlayerAction>();
  const [multiplayerMode, setMultiplayerMode] = useState<boolean>(false);
  const [gameRoundScore, setGameRoundScore] = useState<GameRoundReport | null>(null);
  const [gameSettings, setGameSettings] = useState<GameSettings>();
  const [partySettings, setPartySettings] = useState<PartySettings>();
  
  // mock list of players for multiplayer party
  const mock: Player[] = [
    { id: "p3", name: "Charlie" },
    { id: "p4", name: "Ila" },
  ];

  const handleGameRoundEnd = (report: {finalScore: number}) => {
    setGameRoundScore(report);
    setPlaying(false);
  }


  const handleGoHome = () => {
    setGameRoundScore(null);  // reset game round report state
    setMultiplayerMode(false);
    setPartying(false);
  };



  return (
    <div className="relative h-screen overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center blur-pxs bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Ashurbanipal_in_a_chariot%2C_wall_relief%2C_7th_century_BC%2C_from_Nineveh%2C_the_British_Museum.jpg/3840px-Ashurbanipal_in_a_chariot%2C_wall_relief%2C_7th_century_BC%2C_from_Nineveh%2C_the_British_Museum.jpg')]" />

      <div className="absolute inset-0 bg-black/50" />

      <div className='flex flex-col gap-2 h-screen w-screen items-center justify-center p-2 relative z-10'>
        {playing ? ( // player is playing a game
          <PlayRound
            onRoundEnd={handleGameRoundEnd}
            gameSettings={gameSettings}
          />
        ) : ( // player is not playing a game
          gameRoundScore ? ( // player has just finished playing a game
            <RoundReport
              report={gameRoundScore}
              onGoHome={handleGoHome}
            />
          ) : ( // player hasn't played yet
            multiplayerMode ? ( // player is on multi player mode
              partying ? ( // player is in a party
                <Party
                  onGoHome={handleGoHome}
                  partySettings={partySettings}
                  onSetGameSettings={setGameSettings}
                  onStart={() => setPlaying(true)}
                  players={mock}
                />
              ) : ( // player isn't in a party yet
                multiplayerAction === "create" ? ( // player clicked create
                  <CreateParty
                    onGoHome={handleGoHome}
                    onSetPartySettings={setPartySettings}
                    onCreateParty={() => setPartying(true)}
                  />
                ) : ( // player clicked join
                  <JoinParty
                    onGoHome={handleGoHome}
                    onJoinParty={() => setPartying(true)}
                  />
                )
              )
            ) : ( // player is on singleplayer mode
              <GameSetup
                onStart={() => setPlaying(true)}
                onMultiplayerMode={(value: MultiPlayerAction) => {
                  setMultiplayerMode(true);
                  setMultiplayerAction(value);
                }}
                onSetGameSettings={setGameSettings}
              />
            )
          )
        )}
        {/*!playing ? ( // player not playing a game
          gameRoundScore ? ( // player has finished playing a game
            <RoundReport
              report={gameRoundScore}
              onGoHome={handleGoHome}
            />
          ) : ( // player hasn't played a game yet
            !multiplayerMode ? ( // player is on single player mode
              <GameSetup
                onStart={() => setPlaying(true)}
                onMultiplayerMode={(value: MultiPlayerAction) => {
                  setMultiplayerMode(true);
                  setMultiplayerAction(value);
                }}
                onSetGameSettings={setGameSettings}
              />              
            ) : ( // player is on multiplayer mode
              multiplayerAction === "create" ? ( // player clicked create
                <CreateParty
                  onGoHome={handleGoHome}
                  onSetPartySettings={setPartySettings}
                  onCreateParty={() => setPartying(true)}
                />
              ) : ( // player clicked join
                <JoinParty
                  onGoHome={handleGoHome}
                  onJoinParty={() => setPartying(true)}
                />
              )
              partying && (
                <Party
                  onGoHome={handleGoHome}
                  partySettings={partySettings}
                />
              )
              )
            )
          )
        ) : ( // player is playing a game
          <PlayRound
            onRoundEnd={handleGameRoundEnd}
            gameSettings={gameSettings}
          />
        )*/}
      </div>
    </div>
  );
}

export default App;
