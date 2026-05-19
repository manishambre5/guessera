import { useEffect, useState } from 'react';
import GameSetup from './components/common/GameSetup';
import Arena from './components/common/Arena';
import type { GameRoundReport, GameSettings, MultiPlayerAction, PartySettings } from '@guessera/types';
import RoundReport from './components/common/RoundReport';
import CreateParty from './components/multiplayer/CreateParty';
import JoinParty from './components/multiplayer/JoinParty';
import Party from './components/multiplayer/Party';
import { socket } from './utils/socket';


function App() {
  // STATES
  const [playing, setPlaying] = useState<boolean>(false);
  const [multiplayerAction, setMultiplayerAction] = useState<MultiPlayerAction>();
  const [gameRoundScore, setGameRoundScore] = useState<GameRoundReport | null>(null);
  const [gameSettings, setGameSettings] = useState<GameSettings>();
  const [partySettings, setPartySettings] = useState<PartySettings>();
  const [partyRoomLeaderboard, setPartyRoomLeaderboard] = useState<any[] | null>(null);


  // HANDLERS
  const handleGameRoundEnd = (report: GameRoundReport) => {
    setGameRoundScore(report);
    if (gameSettings?.mode !== "multi") {
      setPlaying(false);
    }
  }

  const handleGoHome = () => {
    socket.emit("leave_party"); // Tell the server about leaving the room before wiping frontend state
    setMultiplayerAction(undefined);
    setGameRoundScore(null);
    setPartyRoomLeaderboard(null);
    setPartySettings(undefined);
  };

  const handleGoBackToRoom = () => {
    setGameRoundScore(null);
    setPartyRoomLeaderboard(null);
  };


  useEffect(() => {
    // Listen for the host starting a multiplayer game
    socket.on("game_started", (incomingSettings: GameSettings) => {
      console.log("The host has started a game! Syncing settings...");

      // Force the host's game config rules
      setGameSettings(incomingSettings);

      // Launch gameplay for guest
      setPlaying(true);

      // reset any old leaderboards
      setPartyRoomLeaderboard(null);
    });

    // Catch the final leaderboard report from the server
     socket.on("game_over_leaderboard", (finalStandings) => {
       console.log("Leaderboard standings received:", finalStandings);
       setPartyRoomLeaderboard(finalStandings);

       // exit Arena.tsx and render RoundReport after everyone's done playing
       setPlaying(false);
     });

    return (() => {
      socket.off("game_started");
      socket.off("game_over_leaderboard");
    });
  }, []);

  return (
    <div className="relative h-full">
      <div className="fixed inset-0 bg-cover bg-center blur-pxs bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Ashurbanipal_in_a_chariot%2C_wall_relief%2C_7th_century_BC%2C_from_Nineveh%2C_the_British_Museum.jpg/3840px-Ashurbanipal_in_a_chariot%2C_wall_relief%2C_7th_century_BC%2C_from_Nineveh%2C_the_British_Museum.jpg')]" />

      <div className="fixed inset-0 bg-black/50" />

      <div className='flex flex-col gap-2 min-h-screen h-full w-screen items-center justify-center p-2 relative z-10'>
        {playing && gameSettings ? ( // player is playing a game
          <Arena
            onRoundEnd={handleGameRoundEnd}
            gameSettings={gameSettings}
            partySettings={partySettings}
          />
        ) : ( // player is not playing a game
          gameRoundScore ? ( // player has just finished playing a game
            <RoundReport
              chosenStatements={gameSettings?.statements || []}
              report={gameRoundScore}
              leaderboard={partyRoomLeaderboard || []}
              onGoHome={handleGoHome}
              onGoBackToRoom={handleGoBackToRoom}
              mode={gameSettings?.mode}
            />
          ) : ( // player hasn't played yet
            multiplayerAction ? ( // player is on multi player mode
              partySettings ? ( // player is in a party
                <Party
                  onGoHome={handleGoHome}
                  partySettings={partySettings}
                  onSetGameSettings={setGameSettings}
                  onStart={() => {}}
                  onUpdatePartySettings={setPartySettings}
                />
              ) : ( // player isn't in a party yet
                multiplayerAction === "create" ? ( // player clicked create
                  <CreateParty
                    onGoHome={handleGoHome}
                    onSetPartySettings={setPartySettings}
                    onCreateParty={() => {}}
                  />
                ) : ( // player clicked join
                  <JoinParty
                    onGoHome={handleGoHome}
                    onJoinParty={() => {}}
                    onPartySettings={setPartySettings}
                  />
                )
              )
            ) : ( // player is on singleplayer mode
              <GameSetup
                onStart={() => setPlaying(true)}
                onMultiplayerMode={(value: MultiPlayerAction) => {
                  setMultiplayerAction(value);
                }}
                onSetGameSettings={setGameSettings}
              />
            )
          )
        )}
      </div>
    </div>
  );
}

export default App;
