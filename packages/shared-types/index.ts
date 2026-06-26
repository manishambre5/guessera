export type Dataset = {
  ancient_history: Statement[];
  post_classical?: Statement[];
  early_modern?: Statement[];
  late_modern?: Statement[];
};

export type StatementBase = {
  id: string;
  statement: string;
  eraLabel: string;
  periodLabel: string;
};

export type Statement =
  | (StatementBase & {
      type: "event";
      year: number;
      yearLabel?: string;
    })
  | (StatementBase & {
      type: "period";
      yearRange: [number, number];
      yearRangeLabel?: string;
    });

export type Guess = number | [number, number];

export type SliderState = { value: [number] | [number, number] };

export type StateTimePeriod = { }

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
  guessedYear: Guess;
  guessScore: number;
};

export type GameRoundReport = {
  roundGuessDetails?: PlayerGuess[];
  finalScore: number;
}

export type GameMode = "single" | "multi";
export type GameDifficulty = "easy" | "medium" | "hard";
export type Era = "ancient" | "post-classical" | "early-modern" | "late-modern";
//export type Period = "early-history" | "classical-antiquity" | "common-era" | "early-post-classical" | "middle-post-classical" | "late-post-classical" | "early-modern" | "late-modern";
export type GameEra = Era[];
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
  roundHistory: RoundStats[];
};

export type RoundStats = {
  roundNumber: number;
  standings: {
    name: string;
    roundScore: number;
    totalScore: number;
  }[];
};