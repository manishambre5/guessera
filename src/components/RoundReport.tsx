import type { GameRoundReport } from "@/types";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";

type GameRoundReportProps = {
  report: GameRoundReport;
  onGoHome: () => void;
};

const RoundReport: React.FC<GameRoundReportProps> = ({ report, onGoHome }) => {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="text-center">
        <CardTitle>
            Your final score: {report.finalScore}
        </CardTitle>
      </CardHeader>
      <CardContent></CardContent>
      <CardFooter>
        <Button className="m-auto" onClick={onGoHome}>
            Home
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RoundReport;