import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Item, ItemContent, ItemHeader } from "../ui/item";
import type { GamePreferences, GameSettings, PartySettings, Player } from "@/types";
import Preferences from "../common/Preferences";
import { useState } from "react";
import { Star } from "lucide-react";

type PartyProps = {
  onStart: () => void;
  onGoHome: () => void;
  partySettings?: PartySettings;
  onSetGameSettings?: (value: GameSettings) => void;
  hostID?: string;
  partyID?: string;
  players?: Player[];
};

export default function Party({ onGoHome, partySettings, onSetGameSettings, players, onStart }: PartyProps) {
    // LOCAL STATES
    const [gamePreferences, setGamePreferences] = useState<GamePreferences>({ noOfStatements: 5, difficulty: "easy" });

    // HANDLERS
    const updateSettings = () => {
        onSetGameSettings?.({ mode: "multi", ...gamePreferences });
        onStart();
    };

  return (
    <Card className="lg:w-1/2 w-full">
        <CardHeader className="text-center">
            <CardTitle className="text-2xl">{partySettings?.partyName} Party</CardTitle>
            <CardDescription>Waiting in Party Room. The host will start a game once everyone's here.</CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="flex flex-col gap-2">

            <Item variant="muted" className="flex flex-col font-semibold">
                <ItemContent>
                    Party Code: {partySettings?.partyCode}
                </ItemContent>
            </Item>

            <Item variant="outline">
                <ItemHeader>Party Room</ItemHeader>
                <ItemContent>
                    <div className="flex gap-2 items-center flex-wrap">
                    {/* List of players ready to play */}
                    <Item variant="outline" className="w-fit">
                        <Star className="size-4" />
                        {partySettings?.hostName}
                    </Item>
                    {players?.map((player) => (
                        <Item key={player.id} variant="outline" className="w-fit">{player.name}</Item>
                    ))}
                    </div>
                </ItemContent>
            </Item>

            <Preferences onSetGamePreferences={setGamePreferences} />

        </CardContent>
        <CardFooter>
            <div className="flex items-center justify-center gap-4 w-full">
                <Button size="lg" onClick={updateSettings}>Start a Game</Button>
                <Button size="lg" onClick={onGoHome}>Home</Button>
            </div>
        </CardFooter>
    </Card>
  );
}