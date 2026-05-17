import type { GameRoundReport, PlayerGuess } from "@guessera/types";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import formatYear from "@/utils/formatYear";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";

type GameRoundReportProps = {
  report: GameRoundReport;
  onGoHome: () => void;
};

const RoundReport: React.FC<GameRoundReportProps> = ({ report, onGoHome }) => {
  return (
    <Card className="lg:w-1/2 w-full max-h-screen flex flex-col">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">
            Your final score: {report.finalScore}
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="flex-1 min-h-0">
        <ScrollArea className="h-full">
        <Table className="">
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead className="">Event</TableHead>
              <TableHead className="text-center">Year</TableHead>
              <TableHead className="text-center">Guess</TableHead>
              <TableHead className="text-center">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {report.roundGuessDetails?.map((item: PlayerGuess, index: number) => (
              <TableRow key={index}>
                <TableCell className="text-muted-foreground text-xs text-right">#{index+1}</TableCell>
                <TableCell className="whitespace-normal md:text-sm text-xs">{item.statement}</TableCell>
                <TableCell className="text-center">{formatYear(item.actualYear)}</TableCell>
                <TableCell className="text-center">{formatYear(item.guessedYear)}</TableCell>
                <TableCell className="text-center bg-accent">{item.guessScore}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <div className="flex items-center justify-center gap-4 w-full">
          <Button size="lg" onClick={onGoHome}>
              Home
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RoundReport;