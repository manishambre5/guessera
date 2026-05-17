import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Item } from "../ui/item";
import type { PartySettings } from "@guessera/types";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useState } from "react";
import { socket } from "@/utils/socket";

type CreatePartyProps = {
  onCreateParty: () => void;
  onGoHome: () => void;
  onSetPartySettings: (value: PartySettings) => void;
};

export default function CreateParty({ onCreateParty, onSetPartySettings, onGoHome }: CreatePartyProps) {
    // LOCAL STATES
    const [hostName, setHostName] = useState<string>("");
    const [partyName, setPartyName] = useState<string>("");

    // HANDLERS
    const handleCreateParty = (e: React.SubmitEvent) => {
        e.preventDefault();

        if (!hostName.trim() || !partyName.trim()) {
            alert("Please fill in both fields!");
            return;
        }

        // Send party room creation request to server
        socket.emit("create_party", { hostName, partyName });
    };

    useEffect(() => {
        socket.connect();

        // Listen for the server successfully creating our party room
        socket.on("party_created", (liveParty: PartySettings) => {
            // Update the parent component's state with the live, synchronized data
            onSetPartySettings?.(liveParty);
            // Go to party room screen
            onCreateParty?.();
        });

        // Listner clean up code
        return () => {
            socket.off("party_created");
        };
    }, [onCreateParty, onSetPartySettings]);

  return (
    <Card className="lg:w-1/2 w-full">
        <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create Party</CardTitle>
            <CardDescription>Create a party to invite friends for a multiplayer game!</CardDescription>
        </CardHeader>

        <Separator />

        <CardContent>
            <form id="handleCreateParty-form" onSubmit={handleCreateParty} className="flex flex-col items-center justify-center">

            <Item>
                <div className="flex gap-2 items-center justify-center w-full">
                    <Label htmlFor="host-name">Host Name</Label>
                    <Input
                        id="host-name"
                        name="host-name"
                        placeholder="Jane Doe IV"
                        className="w-fit"
                        value={hostName}
                        onChange={(e) => setHostName(e.target.value)}
                        required
                    />
                </div>
                <div className="flex gap-2 items-center justify-center w-full">
                    <Label htmlFor="party-name">Party Name</Label>
                    <Input
                        id="party-name"
                        name="party-name"
                        placeholder="heestoreans"
                        className="w-fit"
                        value={partyName}
                        onChange={(e) => setPartyName(e.target.value)}
                        required
                    />
                </div>
            </Item>

            </form>
        </CardContent>
        <CardFooter>
            <div className="flex items-center justify-center gap-4 w-full">
                <Button size="lg" form="handleCreateParty-form" type="submit">Create Party</Button>
                <Button size="lg" onClick={onGoHome}>Home</Button>
            </div>
        </CardFooter>
    </Card>
  );
}