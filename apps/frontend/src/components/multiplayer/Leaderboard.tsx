import type { Player } from "@guessera/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

type LeaderboardProps = {
    players: Player[];
}

export default function Leaderboard({ players }: LeaderboardProps) {

    return (
        <Card className="flex-1 rounded-lg">
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
                    {players.map((player, i) => (
                        <TableRow key={player.id}>
                            <TableCell className="text-right">
                                <Badge
                                    variant="outline"
                                    className={`text-muted-foreground ${
                                        i === 0 ? `bg-amber-100 border-amber-200`
                                        : i === 1 ? `bg-gray-100 border-gray-200`
                                        : i === 2 ? `bg-orange-600/15 border-yellow-600/20`
                                        : `bg-background`}
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
    );
}