import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Button } from "./ui/button";
import { Field, FieldGroup, FieldLabel, FieldSeparator, FieldSet } from "./ui/field";
import { Separator } from "./ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { Item } from "./ui/item";

type GameSetupProps = {
  onStart: () => void;
  onSetNoOfStatements: (value: number) => void;
};

function GameSetup({ onStart, onSetNoOfStatements }: GameSetupProps) {
    //const [gameType, setGameType] = useState<boolean>(false);
    const [isCollapsibleOpen, setIsCollapsibleOpen] = useState<boolean>(false);

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
                    <Collapsible
                        open={isCollapsibleOpen}
                        onOpenChange={setIsCollapsibleOpen}
                        className="flex flex-col items-start w-full gap-2"
                    >
                        <div className="flex items-center gap-2 justify-between w-full">
                            <p className="uppercase">Preferences</p>
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="icon" className="size-8">
                                    <ChevronsUpDown />
                                    <span className="sr-only">Toggle preferences</span>
                                </Button>
                            </CollapsibleTrigger>
                        </div>

                        <CollapsibleContent className="flex gap-2 items-start flex-wrap">

                            <Item variant="default" className="w-fit">
                            <Field>
                                <FieldLabel>No. of Events</FieldLabel>
                                <ToggleGroup
                                    type="single"
                                    variant="outline"
                                    defaultValue="5"
                                    onValueChange={(value) => {
                                        if (value) {
                                            onSetNoOfStatements(Number(value));
                                        }
                                    }}
                                >
                                    <ToggleGroupItem value={"5"} aria-label="5 Events">
                                        5
                                    </ToggleGroupItem>
                                    <ToggleGroupItem value={"15"} aria-label="15 Events">
                                        15
                                    </ToggleGroupItem>
                                    <ToggleGroupItem value={"25"} aria-label="25 Events" disabled>
                                        25
                                    </ToggleGroupItem>
                                </ToggleGroup>
                            </Field>
                            </Item>

                            <Item variant="default" className="w-fit">
                            <Field>
                                <FieldLabel>Difficulty</FieldLabel>
                                <ToggleGroup type="single" variant="outline" defaultValue="easy">
                                    <ToggleGroupItem value="easy" aria-label="5 Events">
                                        Easy
                                    </ToggleGroupItem>
                                    <ToggleGroupItem value="medium" aria-label="Medium">
                                        Medium
                                    </ToggleGroupItem>
                                    <ToggleGroupItem value="hard" aria-label="Hard">
                                        Hard
                                    </ToggleGroupItem>
                                </ToggleGroup>
                            </Field>
                            </Item>

                            {/* TODO: add more preferences */}

                        </CollapsibleContent>
                    </Collapsible>
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