import type { GameMode, GameRoundReport, PlayerGuess, Statement } from "@guessera/types";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "../ui/table";
import formatYear from "@/utils/formatYear";
import { Separator } from "../ui/separator";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { socket } from "@/utils/socket";

type GameRoundReportProps = {
  chosenStatements?: Statement[];
  report: GameRoundReport;
  onGoHome: () => void;
  onGoBackToRoom: () => void;
  mode?: GameMode;
  leaderboard?: any[];
};

const RoundReport: React.FC<GameRoundReportProps> = ({ chosenStatements, report, onGoHome, onGoBackToRoom, mode, leaderboard }) => {
  return (
    <Card className="lg:w-1/2 w-full max-h-screen flex flex-col">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">
            Your final score: {report.finalScore}
        </CardTitle>
      </CardHeader>

      <Separator />

      <CardContent className="flex-1 min-h-0 w-full overflow-hidden">
        <ScrollArea className="h-96 w-full">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead className="min-w-50">Event</TableHead>
                <TableHead className="text-center">Actual Year</TableHead>
                
                {mode === "multi" && leaderboard ? (
                  leaderboard.map((player) => (
                    <TableHead key={player.id}>
                      <div className="flex items-center gap-2 justify-center">
                        <span>{player.name}</span>
                        {player.id === socket.id &&
                          <Badge variant="secondary" className="text-background uppercase bg-emerald-300">you</Badge>
                        }
                      </div>
                    </TableHead>
                  ))
                ) : (
                  <>
                    <TableHead className="text-center">Your Guess</TableHead>
                    <TableHead className="text-center">Score</TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {report.roundGuessDetails?.map((item: PlayerGuess, index: number) => {
                const matchedStatement = chosenStatements?.find(
                  (s: Statement) => s.id === item.statementId
                );

                return (
                  <TableRow key={index}>
                    <TableCell className="text-muted-foreground text-xs text-right">
                      #{index + 1}
                    </TableCell>
                    
                    <TableCell className="whitespace-normal md:text-sm text-xs max-w-xs">
                      {matchedStatement?.statement}
                    </TableCell>
                    
                    <TableCell className="text-center">
                      {formatYear(Number(matchedStatement?.year))}
                    </TableCell>

                    {mode === "multi" && leaderboard ? (
                      leaderboard.map((player) => {
                        const playerGuess = player.guesses?.[index];
                        return (
                          <TableCell key={player.id} className="text-center">
                            {playerGuess && (
                              <div className="flex flex-col items-center justify-center gap-1">
                                <span>
                                  {formatYear(playerGuess.guessedYear)}
                                </span>
                                <Badge variant="secondary">
                                  +{playerGuess.guessScore}
                                </Badge>
                              </div>
                            )}
                          </TableCell>
                        );
                      })
                    ) : (
                      <>
                        <TableCell className="text-center">
                          {formatYear(item.guessedYear)}
                        </TableCell>
                        <TableCell className="text-center bg-accent font-semibold">
                          {item.guessScore}
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>

            <TableFooter className="bg-muted/50 font-bold">
              <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                
                {mode === "multi" && leaderboard ? (
                  leaderboard.map((player) => (
                    <TableCell key={player.id} className="text-center font-bold">
                      {player.score}
                    </TableCell>
                  ))
                ) : (
                  <>
                    <TableCell></TableCell>
                    <TableCell className="text-center bg-accent font-bold">
                      {report.finalScore}
                    </TableCell>
                  </>
                )}
              </TableRow>
            </TableFooter>
            
          </Table>

          <ScrollBar />
        </ScrollArea>
      </CardContent>

      <CardFooter>
        <div className="flex items-center justify-center gap-4 w-full">
          {mode === "multi" ? (
            <Button size="lg" onClick={onGoBackToRoom}>
              Back to Room
            </Button>
          ) : (
            <Button size="lg" onClick={onGoHome}>
              Home
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default RoundReport;