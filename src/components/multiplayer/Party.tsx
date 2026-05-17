import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Item, ItemContent, ItemHeader } from "../ui/item";
import type { GamePreferences, GameSettings, PartySettings } from "@/types";
import Preferences from "../common/Preferences";
import { useState } from "react";

type PartyProps = {
  onStart: () => void;
  onGoHome: () => void;
  partySettings?: PartySettings;
  onSetGameSettings?: (value: GameSettings) => void;
  hostID?: string;
  partyID?: string;
};

export default function Party({ onGoHome, partySettings, onSetGameSettings, onStart }: PartyProps) {
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

        <CardContent>

            <Item>
                <ItemHeader>Players</ItemHeader>
                <ItemContent className="flex gap-2 items-center justify-center w-full">
                    {/* List of players ready to play */}
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