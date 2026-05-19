import type { Player, RoundStats } from "@guessera/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { ScrollArea } from "../ui/scroll-area";

type LeaderboardProps = {
    players: Player[];
    roundHistory: RoundStats[];
}

export default function Leaderboard({ players, roundHistory }: LeaderboardProps) {

    return (
        <div className="flex flex-row-reverse gap-4 w-full">
        {roundHistory.length > 0 && (
        <Card className="rounded-lg">
            <CardHeader className="text-center">
                <CardTitle>Leaderboard</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="flex flex-col gap-2">
                <Table>
                    <TableHeader>
                        <TableRow className="uppercase">
                            <TableHead className="text-right">Rank</TableHead>
                            <TableHead className="text-left">Player</TableHead>
                            <TableHead className="text-center">Score</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[...players]
                            .sort((a, b) => b.score - a.score)
                            .map((player, i) => (
                            <TableRow key={player.id}>
                                <TableCell className="text-right">
                                    <Badge
                                        variant="outline"
                                        className={`text-muted-foreground ${
                                            i === 0 ? `bg-amber-100 border-amber-200`
                                            : i === 1 ? `bg-gray-100 border-gray-200`
                                            : i === 2 ? `bg-orange-600/15 border-yellow-600/20`
                                            : `bg-background`
                                        }`}
                                    >#{i+1}</Badge>
                                </TableCell>
                                <TableCell>{player.name}</TableCell>
                                <TableCell className="font-semibold text-center">{player.score}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
        )}



        {roundHistory.length > 0 && (
        <Card className="flex-1 rounded-lg" size="sm">
            <CardHeader className="text-center">
                <CardTitle>Round History</CardTitle>
            </CardHeader>

            <Separator />

            <CardContent className="flex-1 min-h-0 w-full overflow-hidden flex flex-col gap-4">
                <ScrollArea className="h-64 w-full">
                {roundHistory.map((round) => (
                    <div key={round.roundNumber}>
                        <p className="text-muted-foreground uppercase mt-2">Round {round.roundNumber}</p>
                        <Table>
                            <TableHeader>
                                <TableRow className="uppercase">
                                    <TableHead className="text-left">Player</TableHead>
                                    <TableHead className="text-center">Score</TableHead>
                                    <TableHead className="text-center">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {round.standings.map((entry) => (
                                    <TableRow key={entry.name}>
                                        <TableCell>{entry.name}</TableCell>
                                        <TableCell className="text-center">+{entry.roundScore}</TableCell>
                                        <TableCell className="font-semibold text-center">{entry.totalScore}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {round.roundNumber < roundHistory.length && <Separator className="mt-4" />}
                    </div>
                ))}
                </ScrollArea>
            </CardContent>
        </Card>
        )}
        </div>
    );
}