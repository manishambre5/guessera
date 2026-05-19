export type Statement = {
  id: string;
  statement : string;
  year : string;
  img?: string;
};

export type Player = {
  name : string;
  id : string;
  isHost: boolean;
  score: number;
  isPlaying: boolean;
  guesses: PlayerGuess[];
};

export type PlayerGuess = {
  statementId: string;
  guessedYear: number;
  guessScore: number;
};

export type GameRoundReport = {
  roundGuessDetails?: PlayerGuess[];
  finalScore: number;
}

export type GameMode = "single" | "multi";
export type GameDifficulty = "easy" | "medium" | "hard";
export type MultiPlayerAction = "create" | "join" | null;

export type GamePreferences = {
  noOfStatements: number;
  difficulty: GameDifficulty;
}
export type GameSettings = GamePreferences & {
  mode: GameMode;
  statements?: Statement[];
};

export type PartySettings = {
  hostName: string;
  partyName: string;
  partyCode: string;
  players: Player[];
  gameStarted: boolean;
};