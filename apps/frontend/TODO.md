- In-Game Score Syncing: Emit an event whenever a user answers a question correctly to update their score on the server, for a live leaderboard mid-game. It will show up in the score section of PlayRound component and will show all the players, their scores and the #statemtent they are at.

- Handle Mid-Game Disconnects: If a user drops while a match is live, cleanly remove them from the active players roster without crashing the game state for everyone else. Right now the player who quit still stays in the room.

- Handle Host Migrations Mid-Game: If the host disconnects during gameplay, dynamically assign a new host so the remaining players aren't stranded and can still return to the room at the end.

- Game Room Reset State: When players click your "Return to Party" button, make sure the server resets gameStarted = false and clears out previous scores so a fresh match can start smoothly.

- Sync Transition Screens: Add loading states (host is starting a round, next statement, etc.)