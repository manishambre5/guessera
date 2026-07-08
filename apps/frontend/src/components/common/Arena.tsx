import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Item, ItemActions, ItemContent, ItemHeader, ItemTitle } from "../ui/item";
import { Field, FieldLabel, FieldSeparator } from "../ui/field";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";
import type { GameRoundReport, GameSettings, Guess, PartySettings, PlayerGuess, SliderState, Statement } from "@guessera/types";
import Countdown from "./Countdown";
import formatYear from "@/utils/formatYear";
import { ChevronsLeft, ChevronsRight, Smile } from "lucide-react";
import calculateScore from "@/utils/calculateScore";
import { socket } from "@/utils/socket";
import getDifficultyConfig from "@/utils/sliderBounds";

type ArenaProps = {
  gameSettings?: GameSettings;
  partySettings?: PartySettings;
  onRoundEnd?: (report: GameRoundReport) => void;
};

export default function Arena({ onRoundEnd, gameSettings, partySettings }: ArenaProps) {
    // STATES
    const [chosenStatements, setChosenStatements] = useState<Statement[]>([]);
    const [currentStatementIndex, setCurrentStatementIndex] = useState<number>(0);
    const [sliderState, setSliderState] = useState<SliderState>({value: [0,0]});
    const [playerGuesses, setPlayerGuesses] = useState<PlayerGuess[]>([]);
    const [score, setScore] = useState<number>(0);
    const [round, setRound] = useState<number>(0); // to reset round timer
    const [gameOver, setGameOver] = useState<boolean>(false); // flag to track if player finished their round (in multiplayer mode)

    // REFs
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null); // for smooth hold and press speed increase

    // CONSTANTS
    const currentYear: number = 2000;
    const oldestYear: number = -3199;
    const statement = chosenStatements[currentStatementIndex];
    const isRangeSlider = statement?.type === "period";
    const { min, max, countdown } = getDifficultyConfig({
        statement,
        difficulty: gameSettings?.difficulty,
        oldestYear,
        currentYear,
    });

    // Handle submit guess
    const handleSubmitGuess = (activeSubmit: boolean): void => {
        
        // calculate the score
        const statement = chosenStatements[currentStatementIndex];
        if (!statement) return;

        const actual =
            statement.type === "period"
                ? statement.yearRange
                : statement.year;

        const guess: Guess = activeSubmit
            ? (isRangeSlider
                ? (sliderState.value as [number, number])
                : sliderState.value[0])
            : null;

        // score set to zero if submit button isn't clicked and time has run out
        const calculatedScore = calculateScore(guess, actual, min, max);
        
        // update score state
        setScore((prevScore) => prevScore + calculatedScore);

        // build guess object for report
        const guessData: PlayerGuess = {
            statementId: statement.id,
            guessedYear: guess,
            guessScore: calculatedScore,
        };
        // updating player guess data for report
        setPlayerGuesses((prev) => [...prev, guessData]);

        // check if last statement reached
        if (currentStatementIndex < chosenStatements.length - 1) {
            setRound(prev => prev + 1); // increment round to reset timer
            setCurrentStatementIndex((prev) => prev + 1);// go to next statement
        } else {
            // Build report payload
            const finalReport: GameRoundReport = {
                finalScore: (score || 0) + calculatedScore,
                roundGuessDetails: [...playerGuesses, guessData],
            };

            if (gameSettings?.mode === "multi") {
                setGameOver(true);

                // end round and send final score and guess details back to parent and server
                if (onRoundEnd) onRoundEnd(finalReport);

                socket.emit("submit_score", {
                    partyCode: partySettings?.partyCode,
                    report: finalReport
                });
            } else {
                if (onRoundEnd) onRoundEnd(finalReport);
            }
        }
    };

    // Slider thumb arrow button control
    const moveSliderThumb = (step: 1 | -1, thumbIndex: 0 | 1) => {
        setSliderState((prev) => {
            const next = [...prev.value] as [number] | [number, number];

            // for single thumb slider
            const index = next.length === 1 ? 0 : thumbIndex;
            next[index] = Math.min(
                max,
                Math.max(min, (next[index] ?? next[0]) + step)
            );

            if (next.length === 2) {
                if (index === 0) next[0] = Math.min(next[0], next[1]);
                else next[1] = Math.max(next[1], next[0]);
            }

            return { value: next };
        });
    };
    // handle pointer (thumb mover button click/touch)
    const handlePointerDown = (step: 1 | -1, thumbIndex: 0 | 1) => (e: React.PointerEvent) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        startHolding(step, thumbIndex);
    };
    const handlePointerUp = () => stopHolding();
    // Trigger Hold and Press
    const startHolding = (
        step: 1 | -1,
        thumbIndex: 0 | 1
    ): void => {
        moveSliderThumb(step, thumbIndex); // act on click immediately

        const startTime = Date.now();
        const tick = () => {
            moveSliderThumb(step, thumbIndex);
            // elapsed hold time in seconds
            const holdTime = (Date.now() - startTime) / 1000;

            //Exponential easing curve to start slow at 500ms and go to as fast as 50ms
            const delay = Math.max(50,500 * Math.exp(-holdTime / 2));

            timeoutRef.current = setTimeout(tick, delay);
        };
        timeoutRef.current = setTimeout(tick, 500);
    };
    // Stop Hold and Press
    const stopHolding = (): void => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    };


    useEffect(() => {
        if (gameSettings?.statements && gameSettings.statements.length > 0) {
            setChosenStatements(gameSettings.statements);
            console.log(gameSettings.statements);
        }
    }, [gameSettings]);

    useEffect(() => {
        const statement = chosenStatements[currentStatementIndex];

        if (!statement) return;

        setSliderState({
            value:
                statement.type === "period"
                    ? [(Math.round((min + (Math.round((min + max) / 2))) / 2)), (Math.round(((Math.round((min + max) / 2)) + max) / 2))]
                    : [Math.round((min+max)/2)],
        });
    }, [chosenStatements, currentStatementIndex]);


  return (
    <div className='flex flex-col gap-2 min-h-[calc(100vh-1rem)] size-full justify-between bg-background p-2 box-border rounded-t-lg rounded-b-2xl'>

        {/* Score and Timer */}
        <header className="h-fit flex flex-row-reverse gap-2 justify-between items-start">
            {/* Score */}
            <Item variant="muted" className="w-fit flex flex-col">
                <ItemHeader className="">SCORE</ItemHeader>
                <ItemContent>
                    <ItemTitle className="text-2xl">{score}</ItemTitle>
                </ItemContent>
            </Item>

            {/* Timer */}
            <Item variant="muted" className={`w-fit flex flex-col transition-opacity duration-300 ${gameOver ? "opacity-20 pointer-events-none" : ""}`}>
                <ItemHeader className="">TIME LEFT</ItemHeader>
                <ItemContent>
                    <ItemTitle className="text-2xl">
                        {gameOver ? "00" :
                            <Countdown key={round} limit={countdown} onComplete={() => handleSubmitGuess(false)} />
                        }
                    </ItemTitle>
                </ItemContent>
            </Item>
        </header>

        {/* Statement section */}
        <section className="flex-1 md:min-h-96x flex flex-col items-center justify-center">
            {gameOver ? (
                <Card className="flex-1 flex flex-col justify-center aspect-video md:aspect-auto w-full">
                    <CardHeader className="flex flex-col items-center">
                        <Smile />
                        <CardTitle className="text-xl text-center">
                            Round Completed. Waiting for the rest to finish the round.
                        </CardTitle>
                    </CardHeader>
                    
                </Card>
            ) : chosenStatements.length > 0 && currentStatementIndex < chosenStatements.length ? (
                <Card className="w-full">
                    <CardHeader className="text-center">
                        <CardTitle className="md:text-xl lg:text-2xl">{chosenStatements[currentStatementIndex].statement}</CardTitle>
                    </CardHeader>
                </Card>
            ) : (
                <Item className="text-destructive bg-destructive/10 flex flex-col w-fit">Nothing left to guess :(</Item>
            )}
        </section>

        {/* Guess Form section */}
        <section className={`h-fit flex items-end transition-opacity duration-300 ${gameOver ? "opacity-20 pointer-events-none" : ""}`}>
            <Card className="w-full" size="sm">
                <CardContent>
                <form
                    className="flex flex-col gap-4 h-1/3"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmitGuess(true);
                    }}
                >
                    {/* Guess Controls */}
                    <div className="flex gap-1">
                        <Button
                            type="button"
                            variant="secondary"
                            size="icon-lg"
                            onPointerDown={(e) => handlePointerDown(-1, 0)(e)}
                            onPointerUp={handlePointerUp}
                            onPointerLeave={handlePointerUp}
                            onPointerCancel={handlePointerUp}
                        >
                            <ChevronsLeft />
                        </Button>
                        <Field className='w-full'>
                            <Slider
                                min={min}
                                max={max}
                                step={1}
                                value={sliderState.value}
                                onValueChange={(val) => {
                                    setSliderState({
                                        value: isRangeSlider
                                            ? val as [number, number]
                                            : [val[0]] as [number],
                                    });
                                }}
                                className="py-4"
                            />
                        <FieldLabel className='text-muted-foreground w-full flex flex-col -mt-4 gap-0'>
                            <div className="flex w-full">
                                <span className="border-r border-muted-foreground h-3 w-0 mr-auto" />
                                <span className="border-r border-muted-foreground h-3 w-0 m-auto" />
                                <span className="border-r border-muted-foreground h-3 w-0 ml-auto" />
                            </div>
                            <div className="flex w-full">
                                <span className="text-xs mr-auto">
                                    {formatYear(min)}
                                </span>
                                <span className="text-xs m-auto">
                                    {formatYear(Math.round((min+max)/2))}
                                </span>
                                <span className="text-xs ml-auto">
                                    {formatYear(max)}
                                </span>
                            </div>
                        </FieldLabel>
                        </Field>
                        <Button
                            type="button"
                            variant="secondary"
                            size="icon-lg"
                            onPointerDown={(e) => handlePointerDown(1, 1)(e)}
                            onPointerUp={handlePointerUp}
                            onPointerLeave={handlePointerUp}
                            onPointerCancel={handlePointerUp}
                        >
                            <ChevronsRight />
                        </Button>
                    </div>

                    <FieldSeparator />

                    <Item variant="muted">
                        <ItemContent>
                            {statement?.type === "period" && sliderState.value.length === 2 ? (
                                <ItemTitle className="font-bold md:text-lg">
                                    {formatYear(sliderState.value[0])}
                                    <span>-</span>
                                    {formatYear(sliderState.value[1])}
                                </ItemTitle>
                            ) : (
                                <ItemTitle className="font-bold text-lg">
                                    {formatYear(sliderState.value[0])}
                                </ItemTitle>
                            )}
                        </ItemContent>
                        <ItemActions>
                            <Button 
                                type='submit'
                                size="lg"
                            >
                                Submit Guess
                            </Button>
                        </ItemActions>
                    </Item>
                </form>
                </CardContent>
            </Card>
        </section>

    </div>
  );
}