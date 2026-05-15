export type Statement = {
  statement : string;
  year : string;
};

export type PlayRoundProps = {
  mode: "single" | "multi";
  difficulty?: "easy" | "medium" | "hard";
  onRoundEnd?: (report: GameRoundReport) => void;
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

export type CountdownProps = {
  limit: number;
  onComplete?: () => void;
};