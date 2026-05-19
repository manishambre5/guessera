import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Item } from "../ui/item";
import type { PartySettings } from "@guessera/types";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useState } from "react";
import { socket } from "@/utils/socket";

type JoinPartyProps = {
  onGoHome: () => void;
  onPartySettings: (value: PartySettings) => void;
};

export default function JoinParty({ onGoHome, onPartySettings }: JoinPartyProps) {
    // LOCAL STATES
    const [playerName, setPlayerName] = useState<string>("");
    const [partyCode, setPartyCode] = useState<string>("");
    const [error, setError] = useState<string>("");

    // HANDLERS
    const handleJoinParty = (e: React.SubmitEvent) => {
        e.preventDefault();
        setError(""); // clear old errors

        if (!playerName.trim() || !partyCode.trim()) {
            alert("Please fill in both fields!");
            return;
        }

        // Send the join party request to server
        socket.emit("join_party", { 
            partyCode: partyCode.trim(), 
            playerName: playerName.trim() 
        });
    };

    useEffect(() => {

        // Listen for validation errors from the server
        socket.on("error_message", (msg: string) => {
            setError(msg);
        });

        // Listner clean up code
        return () => {
            socket.off("error_message");
        };
    }, [onPartySettings]);

  return (
    <Card className="lg:w-1/2 w-full">
        <CardHeader className="text-center">
            <CardTitle className="text-2xl">Join Party</CardTitle>
            <CardDescription>Join a party to play with friends!</CardDescription>
        </CardHeader>

        <Separator />

        <CardContent>
            <form id="handleJoinParty-form" onSubmit={handleJoinParty} className="flex flex-col items-center justify-center">

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

            {error && (
                <Item className="text-destructive bg-destructive/10 flex flex-col w-fit">{error}</Item>
            )}

            </form>
        </CardContent>
        <CardFooter>
            <div className="flex items-center justify-center gap-4 w-full">
                <Button size="lg" form="handleJoinParty-form" type="submit">Join Party</Button>
                <Button size="lg" onClick={onGoHome}>Home</Button>
            </div>
        </CardFooter>
    </Card>
  );
}