import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Item, ItemContent, ItemHeader } from "../ui/item";
import type { GamePreferences, GameSettings, PartySettings } from "@guessera/types";
import Preferences from "../common/Preferences";
import { useEffect, useState } from "react";
import { socket } from "@/utils/socket";
import { Copyable } from "../ui/copyable";
import pickRandomStatements from "@/utils/pickRandomStatements";
import Leaderboard from "./Leaderboard";
import PartyHistory from "./PartyHistory";
import { Badge } from "../ui/badge";

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
        // Only host can start a game (at least for now)
        if (!isHost) return;

        // Generate shared set of statements for a multiplayer game
        const totalStatements = gamePreferences.noOfStatements ?? 5;
        const synchedStatements = pickRandomStatements(totalStatements);

        // combining settings and statements together
        const multiplayerGameSettings: GameSettings = {
            ...gamePreferences,
            mode: "multi",
            statements: synchedStatements
        };

        onSetGameSettings?.(multiplayerGameSettings);

        socket.emit("start_game",{
            partyCode: partySettings.partyCode,
            settings: (multiplayerGameSettings)
        });

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
        <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-2xl">{partySettings.partyName || "unnamed"} Party</CardTitle>

            <Item variant="muted" size="xs" className="w-fit flex flex-col">
                <ItemContent className="flex flex-row items-center">
                    <p className="text-muted-foreground px-2">Party Code:</p>
                    <Copyable target={partySettings.partyCode} />
                </ItemContent>
            </Item>
        </CardHeader>

        <Separator />

        <CardContent className="flex flex-col gap-2">

            <Item variant="outline" className="bg-background">
                <ItemHeader>Party Room ({partySettings.players.length || 0} players)</ItemHeader>
                <ItemContent>
                    <div className="flex gap-2 items-center flex-wrap">
                        {partySettings.players.map((player) => (
                            <Item key={player.id} variant="outline" size="xs" className="w-fit flex items-center">
                                <span className="text-xl">{player.name}</span>
                                {player.isHost &&
                                    <Badge variant="secondary" className="text-muted-foreground uppercase">host</Badge>
                                }
                                {player.id === socket.id &&
                                    <Badge variant="secondary" className="text-muted-foreground uppercase">you</Badge>
                                }
                            </Item>
                        ))}
                    </div>
                </ItemContent>
            </Item>

            <div className="flex gap-2">
                <Leaderboard players={partySettings.players} />
                <PartyHistory />
            </div>

            {isHost && (
                <Preferences onSetGamePreferences={setGamePreferences} />
            )}

            {error &&
                <Item className="text-destructive bg-destructive/10 flex flex-col w-fit">{error}</Item>
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