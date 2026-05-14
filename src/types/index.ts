export type Statement = {
  statement : string;
  year : string;
};

export type GameRoundReport = {
  statements? : string[];
  actualYear? : string[];
  scores?: number[];
  scoreIncrements? : number[];
  finalScore: number;
}

export type CountdownProps = {
  limit: number;
  onComplete?: () => void;
};