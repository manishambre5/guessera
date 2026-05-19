import type { Player } from "@guessera/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Item } from "../ui/item";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";

type LeaderboardProps = {
    players: Player[];
}

export default function Leaderboard({ players }: LeaderboardProps) {

    return (
        <Card size="sm" className="flex-1 rounded-lg">
            <CardHeader className="text-center">
                <CardTitle>Leaderboard</CardTitle>
            </CardHeader>

            <Separator />

            <CardContent className="flex flex-col gap-2">
                {players.map((player, i) => (
                    <Item className="flex items-center justify-between" key={player.id} variant="outline">
                        <span className="flex gap-2 items-center">
                            <Badge
                                variant="outline"
                                className={`text-muted-foreground ${
                                    i === 0 ? `bg-amber-100 border-amber-200`
                                    : i === 1 ? `bg-gray-100 border-gray-200`
                                    : i === 2 ? `bg-yellow-600/30 border-yellow-600/10`
                                    : `bg-background`}
                                }`}
                            >#{i+1}</Badge>
                            <span>{player.name}</span>
                        </span>
                        <span className="font-semibold">{player.score}</span>
                    </Item>
                ))}
            </CardContent>
        </Card>
    );
}