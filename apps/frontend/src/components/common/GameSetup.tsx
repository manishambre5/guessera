import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { Button } from "../ui/button";
import { FieldGroup, FieldSet } from "../ui/field";
import { Separator } from "../ui/separator";
import { useState } from "react";
import { type GamePreferences, type GameMode, type GameSettings, type MultiPlayerAction } from "@guessera/types";
import Preferences from "./Preferences";

type GameSetupProps = {
  onStart: () => void;
  onMultiplayerMode: (value: MultiPlayerAction) => void;
  onSetGameSettings?: (value: GameSettings) => void;
};

function GameSetup({ onStart, onMultiplayerMode, onSetGameSettings }: GameSetupProps) {
    // LOCAL STATES
    const [mode, setMode] = useState<GameMode>("single");
    const [gamePreferences, setGamePreferences] = useState<GamePreferences>({ noOfStatements: 5, difficulty: "easy" });

    // HANDLERS
    const updateSettings = (value: MultiPlayerAction) => {
        onSetGameSettings?.({ mode, ...gamePreferences });
        if (mode === "multi") {
            if (value === "create") onMultiplayerMode(value);
            else if (value === "join") onMultiplayerMode(value);
        } else onStart();
    };

  return (
    <Card className="lg:w-1/2 w-full">
        <CardHeader className="text-center">
            <CardTitle className="text-3xl">Welcome to <span className="font-logo text-chart-4 italic font-bold text-4xl">GuessEra</span></CardTitle>
            <CardDescription>Guess the year when a historical event occurred!</CardDescription>
        </CardHeader>

        <Separator />

        <CardContent>
            <form>
                <FieldGroup>
                    <FieldSet>
                        <ToggleGroup
                            type="single"
                            variant="outline"
                            size="lg"
                            className="w-full"
                            defaultValue="single"
                            onValueChange={(value) => {
                                if (value) {
                                    setMode(value as GameMode);
                                }
                            }}
                        >
                            <ToggleGroupItem
                                value="single"
                                aria-label="Single Player"
                                className="flex flex-col items-center justify-center w-1/2 min-h-24"
                                defaultChecked
                            >
                                <span className="text-2xl leading-none font-light">Single Player</span>
                                <span className="text-xs text-muted-foreground">Get some practice alone.</span>
                            </ToggleGroupItem>
                            <ToggleGroupItem
                                value="multi"
                                aria-label="Multi-Player"
                                className="flex flex-col items-center justify-center w-1/2 min-h-24"
                            >
                                <span className="text-2xl leading-none font-light">Multi-Player</span>
                                <span className="text-xs text-muted-foreground text-wrap">Play with friends. (Coming soon)</span>
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </FieldSet>

                    {mode === "single" &&
                        <Preferences onSetGamePreferences={setGamePreferences} />
                    }

                </FieldGroup>
            </form>
        </CardContent>
        <CardFooter>
            {mode === "single" ? (
                <div className="flex items-center justify-center gap-4 w-full">
                    <Button
                        size="lg"
                        onClick={() => updateSettings(null)}
                        type="button"
                    >
                        Start Game
                    </Button>
                </div>
            ) : (
                <div className="flex items-center justify-center gap-4 w-full">
                    <Button
                        size="lg"
                        onClick={() => updateSettings("create")}
                        type="button"
                    >
                        Create Party
                    </Button>
                    <Button
                        size="lg"
                        onClick={() => updateSettings("join")}
                        type="button"
                    >
                        Join Party
                    </Button>
                </div>
            )}
        </CardFooter>
    </Card>
  );
}

export default GameSetup;