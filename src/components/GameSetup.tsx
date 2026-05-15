import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Button } from "./ui/button";
import { FieldGroup, FieldLegend, FieldSeparator, FieldSet } from "./ui/field";
import { Separator } from "./ui/separator";

type GameSetupProps = {
  onStart: () => void;
};

function GameSetup({ onStart }: GameSetupProps) {
    //const [gameType, setGameType] = useState<boolean>(false);

  return (
    <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome to guessEra!</CardTitle>
            <CardDescription>Guess the year when a historical event occured!</CardDescription>
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
                            defaultValue="0"
                        >
                            <ToggleGroupItem
                                value="0"
                                aria-label="Single Player"
                                className="flex flex-col items-center justify-center w-1/2 min-h-24"
                                defaultChecked
                            >
                                <span className="text-2xl leading-none font-light">Single Player</span>
                                <span className="text-xs text-muted-foreground">Get some practice alone.</span>
                            </ToggleGroupItem>
                            <ToggleGroupItem
                                value="1"
                                aria-label="Multi-Player"
                                className="flex flex-col items-center justify-center w-1/2 min-h-24"
                                disabled
                            >
                                <span className="text-2xl leading-none font-light">Multi-Player</span>
                                <span className="text-xs text-muted-foreground text-wrap">Play with friends. (Coming soon)</span>
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </FieldSet>

                    <FieldSeparator />

                    <FieldSet>
                        <FieldLegend>{/* Game Preferences */}</FieldLegend>
                        <FieldGroup>
                            {/* TODO: add preferences */}
                        </FieldGroup>
                    </FieldSet>
                </FieldGroup>
            </form>
        </CardContent>
        <CardFooter>
            <Button className="m-auto" size="lg" onClick={onStart}>Start Game</Button>
        </CardFooter>
    </Card>
  );
}

export default GameSetup;