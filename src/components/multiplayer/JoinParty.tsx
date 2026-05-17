import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Item } from "../ui/item";
import type { PartySettings } from "@/types";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";

type JoinPartyProps = {
  onJoinParty?: () => void;
  onGoHome: () => void;
  onPartySettings?: (value: PartySettings) => void;
  hostID?: string;
  partyID?: string;
};

export default function JoinParty({ onGoHome, onJoinParty }: JoinPartyProps) {
    // LOCAL STATES
    const [playerName, setPlayerName] = useState<string>("");
    const [partyCode, setPartyCode] = useState<string>("");

    // HANDLERS
    const handleJoinParty = () => {
        if (!playerName.trim() || !partyCode.trim()) {
            alert("Please fill in both fields");
            return;
        }

        // TODO: Error handling for party code

        onJoinParty?.();
    };

  return (
    <Card className="lg:w-1/2 w-full">
        <CardHeader className="text-center">
            <CardTitle className="text-2xl">Join Party</CardTitle>
            <CardDescription>Join a party to play with friends!</CardDescription>
        </CardHeader>

        <Separator />

        <CardContent>
            <form className="flex flex-col items-center justify-center">

            <Item>
                <div className="flex gap-2 items-center justify-center w-full">
                    <Label htmlFor="player-name">Your Name</Label>
                    <Input
                        id="player-name"
                        name="player-name"
                        placeholder="John Doe III"
                        className="w-fit"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        required
                    />
                </div>
                <div className="flex gap-2 items-center justify-center w-full">
                    <Label htmlFor="party-code">Party Code</Label>
                    <Input
                        id="party-code"
                        name="party-code"
                        placeholder="a6o%Ez23"
                        className="w-fit"
                        value={partyCode}
                        onChange={(e) => setPartyCode(e.target.value)}
                        required
                    />
                </div>
            </Item>

            </form>
        </CardContent>
        <CardFooter>
            <div className="flex items-center justify-center gap-4 w-full">
                <Button size="lg" onClick={handleJoinParty}>Join Party</Button>
                <Button size="lg" onClick={onGoHome}>Home</Button>
            </div>
        </CardFooter>
    </Card>
  );
}