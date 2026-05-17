import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Item, ItemContent, ItemHeader } from "../ui/item";
import type { GamePreferences, GameSettings, PartySettings } from "@guessera/types";
import Preferences from "../common/Preferences";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { socket } from "@/utils/socket";

type PartyProps = {
  onStart: () => void;
  onGoHome: () => void;
  partySettings: PartySettings;
  onSetGameSettings: (value: GameSettings) => void;
  onUpdatePartySettings: (value: PartySettings) => void;
};

export default function Party({ onGoHome, partySettings, onSetGameSettings, onUpdatePartySettings, onStart }: PartyProps) {
    // LOCAL STATES
    const [gamePreferences, setGamePreferences] = useState<GamePreferences>({ noOfStatements: 5, difficulty: "easy" });
    const [error, setError] = useState("");
    const isHost = partySettings.players.find(p => p.id === socket.id)?.isHost ?? false;

    // HANDLERS
    const handleStartGame = () => {
        if (!isHost) return;
        onSetGameSettings?.({ mode: "multi", ...gamePreferences });

        // TODO: In the next step, emit a "start_game" event to the server here so that it forces all connected guests to transition to the game board at once.

        onStart();
    }


    useEffect(() => {
        // Listen for player array changes (joins, leaves, host switches)
        socket.on("party_updated", (updatedParty: PartySettings) => {
            onUpdatePartySettings?.(updatedParty);
        });

        socket.on("error_message", (msg: string) => {
            setError(msg);
        });

        // Listner clean up code
        return () => {
            socket.off("party_updated");
            socket.off("error_message");
        };
    }, [onUpdatePartySettings]);


  return (
    <Card className="lg:w-1/2 w-full">
        <CardHeader className="text-center">
            <CardTitle className="text-2xl">{partySettings.partyName || "unnamed"} Party</CardTitle>
            <CardDescription>
                {isHost 
                    ? "Configure settings and start the match whenever your party is ready!" 
                    : "Waiting in Party Room. The host will start a game once everyone's here."
                }
            </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="flex flex-col gap-2">

            <Item variant="muted" className="flex flex-col font-semibold">
                <ItemContent>
                    Party Code: {partySettings.partyCode}
                </ItemContent>
            </Item>

            <Item variant="outline">
                <ItemHeader>Party Room ({partySettings.players.length || 0} players)</ItemHeader>
                <ItemContent>
                    <div className="flex gap-2 items-center flex-wrap">
                        {partySettings.players.map((player) => (
                            <Item key={player.id} variant="outline" className="w-fit gap-1">
                                {player.isHost &&
                                    <Star className="size-4 fill-chart-2 text-chart-2" />
                                }
                                <span>{player.name}</span>
                                {player.id === socket.id &&
                                    <span className="text-muted-foreground">(You)</span>
                                }
                            </Item>
                        ))}
                    </div>
                </ItemContent>
            </Item>

            {isHost && (
                <Preferences onSetGamePreferences={setGamePreferences} />
            )}

            {error &&
                <p className="text-sm font-medium text-destructive bg-destructive/10 px-3 py-2 rounded-md w-full text-center">{error}</p>
            }

        </CardContent>
        <CardFooter>
            <div className="flex items-center justify-center gap-4 w-full">
                {isHost && (
                    <Button size="lg" onClick={handleStartGame}>
                        Start a Game
                    </Button>
                )}
                <Button size="lg" onClick={onGoHome}>Home</Button>
            </div>
        </CardFooter>
    </Card>
  );
}