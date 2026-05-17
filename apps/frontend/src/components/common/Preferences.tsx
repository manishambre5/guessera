import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Field, FieldLabel, FieldSet } from "../ui/field";
import { Item, ItemContent } from "../ui/item";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import type { GameDifficulty, GamePreferences } from "@guessera/types";
import { useState } from "react";

type PreferencesProps = {
    onSetGamePreferences?: (value: GamePreferences) => void;
};

export default function Preferences({ onSetGamePreferences }: PreferencesProps) {
    // LOCAL STATES
    const [noOfStatements, setNoOfStatements] = useState<number>(5);
    const [difficulty, setDifficulty] = useState<GameDifficulty>("easy");
    const [isCollapsibleOpen, setIsCollapsibleOpen] = useState<boolean>(false);
    const [saveAlert, setSaveAlert] = useState<boolean>(false);

    // HANDLERS
    const updatePreferences = () => {
        onSetGamePreferences?.({ noOfStatements, difficulty });
        setSaveAlert(true);
        setTimeout(() => {setSaveAlert(false)}, 1000);
    };

    return (
        <FieldSet>
            <Collapsible
                open={isCollapsibleOpen}
                onOpenChange={setIsCollapsibleOpen}
                className="flex flex-col items-start w-full gap-2"
            >
                <Item>
                    <ItemContent className="uppercase">Game Preferences</ItemContent>
                    <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                            <ChevronsUpDown />
                            <span className="sr-only">Toggle preferences</span>
                        </Button>
                    </CollapsibleTrigger>
                </Item>

                <CollapsibleContent className="flex flex-col gap-2 items-start flex-wrap">
                    <div className="flex gap-2 items-start flex-wrap">

                    <Item variant="default" className="w-fit">
                    <Field>
                        <FieldLabel>No. of Events</FieldLabel>
                        <ToggleGroup
                            type="single"
                            variant="outline"
                            defaultValue="5"
                            onValueChange={(value) => {
                                if (value) {
                                    setNoOfStatements(Number(value));
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
                        <ToggleGroup
                            type="single"
                            variant="outline"
                            defaultValue="easy"
                            onValueChange={(value) => {
                                if (value) {
                                    setDifficulty(value as GameDifficulty);
                                }
                            }}
                        >
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

                    </div>

                    <Item>
                        {saveAlert ? (
                            <Button
                                variant="default"
                                type="button"
                                disabled
                            ><Check className="animate-in fade-in fade-out duration-300" />Saved</Button>
                        ) : (
                                <Button
                                variant="default"
                                onClick={updatePreferences}
                                type="button"
                            >Save</Button>
                        )}
                    </Item>

                </CollapsibleContent>
            </Collapsible>
        </FieldSet>
    );
}