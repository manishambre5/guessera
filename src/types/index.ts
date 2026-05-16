export type Statement = {
  statement : string;
  year : string;
};

export type PlayerGuess = {
  statement: string;
  actualYear: number;
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
};

export type PartySettings = {
  noOfStatements: number;
  difficulty: GameDifficulty;
};