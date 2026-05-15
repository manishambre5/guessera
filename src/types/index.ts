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

export type GameSettings = {
  mode: GameMode;
  noOfStatements: number;
  difficulty: string;
};