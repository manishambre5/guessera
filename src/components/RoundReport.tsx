import type { GameRoundReport, PlayerGuess } from "@/types";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import formatYear from "@/utils/formatYear";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

type GameRoundReportProps = {
  report: GameRoundReport;
  onGoHome: () => void;
};

const RoundReport: React.FC<GameRoundReportProps> = ({ report, onGoHome }) => {
  return (
    <Card className="lg:w-1/2 w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">
            Your final score: {report.finalScore}
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent>
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
      </CardContent>
      <CardFooter>
        <Button className="m-auto" onClick={onGoHome}>
            Home
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RoundReport;