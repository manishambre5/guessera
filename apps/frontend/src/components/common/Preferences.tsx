import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Field, FieldLabel, FieldSet } from "../ui/field";
import { Item } from "../ui/item";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import type { GameDifficulty, GameEra, GamePreferences } from "@guessera/types";
import { useState } from "react";
import { Separator } from "../ui/separator";

type PreferencesProps = {
    onSetGamePreferences?: (value: GamePreferences) => void;
};

export default function Preferences({ onSetGamePreferences }: PreferencesProps) {
    // LOCAL STATES
    const [noOfStatements, setNoOfStatements] = useState<number>(5);
    const [difficulty, setDifficulty] = useState<GameDifficulty>("easy");
    const [era, setEra] = useState<GameEra>([]);
    const [isCollapsibleOpen, setIsCollapsibleOpen] = useState<boolean>(false);
    const [saveAlert, setSaveAlert] = useState<boolean>(false);

    // HANDLERS
    const updatePreferences = () => {
        onSetGamePreferences?.({ noOfStatements, difficulty });
        console.log(era); // TODO: use era
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

                <CollapsibleTrigger asChild>
                    <Button variant="secondary" className="w-fit">
                        <span className="uppercase font-normal">Game Preferences</span>
                        <ChevronsUpDown />
                        <span className="sr-only">Toggle preferences</span>
                    </Button>
                </CollapsibleTrigger>


                <CollapsibleContent className="flex flex-col gap-2 items-start flex-wrap animate-collapsible-down">
                    <Item variant="outline">
                    <Field orientation="horizontal">
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
                            <ToggleGroupItem value="easy" aria-label="Easy" className="flex flex-col items-center justify-center p-2 size-fit">
                                <span className="text-base leading-none font-light">Curious</span>
                                <span className="text-xs text-muted-foreground font-light">Easy</span>
                            </ToggleGroupItem>
                            <ToggleGroupItem value="medium" aria-label="Medium" className="flex flex-col items-center justify-center p-2 size-fit">
                                <span className="text-base leading-none font-light">Nerd</span>
                                <span className="text-xs text-muted-foreground font-light">Medium</span>
                            </ToggleGroupItem>
                            <ToggleGroupItem value="hard" aria-label="Hard" className="flex flex-col items-center justify-center size-fit p-2">
                                <span className="text-base leading-none font-light">Historian</span>
                                <span className="text-xs text-muted-foreground font-light">Hard</span>
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </Field>
                    
                    <Separator />
                    
                    <Field orientation="horizontal">
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
                            <ToggleGroupItem value={"25"} aria-label="25 Events">
                                25
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </Field>

                    <Separator />

                    <Field orientation="horizontal">
                        <FieldLabel>Era</FieldLabel>
                        <ToggleGroup
                            type="multiple"
                            variant="outline"
                            defaultValue={["ancient","post-classical","early-modern","late-modern"]}
                            onValueChange={(value) => {
                                if (value) {
                                    setEra(value as GameEra);
                                }
                            }}
                            orientation="vertical"
                        >
                            <ToggleGroupItem value="ancient" aria-label="Ancient" className="flex flex-col items-center justify-center p-2 h-fit">
                                <span className="text-base leading-none font-light">Ancient History</span>
                                <span className="text-xs text-muted-foreground font-light">c. 3200 BCE – c. 500 CE</span>
                            </ToggleGroupItem>
                            <ToggleGroupItem value="post-classical" aria-label="Post Classical" className="flex flex-col items-center justify-center p-2 h-fit">
                                <span className="text-base leading-none font-light">Post-Classical</span>
                                <span className="text-xs text-muted-foreground font-light">c. 500 – c. 1499 CE</span>
                            </ToggleGroupItem>
                            <ToggleGroupItem value="early-modern" aria-label="Early Modern" className="flex flex-col items-center justify-center h-fit p-2">
                                <span className="text-base leading-none font-light">Early Modern</span>
                                <span className="text-xs text-muted-foreground font-light">c. 1500 – c. 1899 CE</span>
                            </ToggleGroupItem>
                            <ToggleGroupItem value="late-modern" aria-label="Late Modern" className="flex flex-col items-center justify-center h-fit p-2">
                                <span className="text-base leading-none font-light">Late Modern</span>
                                <span className="text-xs text-muted-foreground font-light">c. 1900 – c. 1999 CE</span>
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </Field>

                    {/* TODO: add more preferences */}

                    </Item>


                    {saveAlert ? (
                        <Button
                            variant="secondary"
                            type="button"
                            disabled
                        ><Check className="animate-in fade-in fade-out duration-300" />Saved</Button>
                    ) : (
                            <Button
                            variant="secondary"
                            onClick={updatePreferences}
                            type="button"
                        >Save</Button>
                    )}


                </CollapsibleContent>
            </Collapsible>
        </FieldSet>
    );
}