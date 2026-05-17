import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Item, ItemContent, ItemHeader } from "../ui/item";
import type { PartySettings } from "@/types";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";

type CreatePartyProps = {
  onCreateParty?: () => void;
  onGoHome: () => void;
  onSetPartySettings?: (value: PartySettings) => void;
  hostID?: string;
  partyID?: string;
};

export default function CreateParty({ onCreateParty, onSetPartySettings, onGoHome }: CreatePartyProps) {
    // LOCAL STATES
    const [hostName, setHostName] = useState<string>("");
    const [partyName, setPartyName] = useState<string>("");
    const [partyCode, setPartyCode] = useState<string>("");

    // HANDLERS
    const handleCreateParty = () => {
        if (!hostName.trim() || !partyName.trim()) {
            alert("Please fill in both fields");
            return;
        }

        // Generate random 4-character party code
        const code = Math.random().toString(36).substring(2, 6).toUpperCase();
        setPartyCode(code);

        onSetPartySettings?.({ hostName, partyName, partyCode: code });
        onCreateParty?.();
    };

  return (
    <Card className="lg:w-1/2 w-full">
        <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create Party</CardTitle>
            <CardDescription>Create a party to invite friends for a multiplayer game!</CardDescription>
        </CardHeader>

        <Separator />

        <CardContent>
            <form className="flex flex-col items-center justify-center">

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

            <Item variant="outline" className="w-full">
                <ItemHeader>Share the Party code with your friends so they can join!</ItemHeader>
                <ItemContent>
                    {partyCode && <p className="text-2xl text-center">{partyCode}</p>}
                </ItemContent>
            </Item>

            </form>
        </CardContent>
        <CardFooter>
            <div className="flex items-center justify-center gap-4 w-full">
                <Button size="lg" onClick={handleCreateParty}>Create Party</Button>
                <Button size="lg" onClick={onGoHome}>Home</Button>
            </div>
        </CardFooter>
    </Card>
  );
}