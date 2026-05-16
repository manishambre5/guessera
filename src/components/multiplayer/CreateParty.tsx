import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Item, ItemContent, ItemHeader } from "../ui/item";
import type { PartySettings } from "@/types";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type CreatePartyProps = {
  onStart?: () => void;
  onGoHome: () => void;
  onPartySettings?: (value: PartySettings) => void;
  hostID?: string;
  partyID?: string;
};

export default function CreateParty({ onGoHome }: CreatePartyProps) {
    // LOCAL STATES

    // HANDLERS

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
                    <Label htmlFor="partyName">Party Name</Label>
                    <Input
                        id="party-name"
                        name="party-name"
                        placeholder="heestoreans"
                        className="w-fit"
                    />
                </div>
            </Item>

            <Item variant="outline" className="w-fit">
                <ItemHeader>Share the Party code with your friends so they can join!</ItemHeader>
                <ItemContent>
                    {/* Code to generate party code for sharing */}
                </ItemContent>
            </Item>

            </form>
        </CardContent>
        <CardFooter>
            <div className="flex items-center justify-center gap-4 w-full">
                <Button size="lg" onClick={undefined}>Create Party</Button>
                <Button size="lg" onClick={onGoHome}>Home</Button>
            </div>
        </CardFooter>
    </Card>
  );
}