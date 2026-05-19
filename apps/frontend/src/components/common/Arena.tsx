import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Item, ItemActions, ItemContent, ItemHeader, ItemTitle } from "../ui/item";
import { Field, FieldLabel, FieldSeparator } from "../ui/field";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";
import type { GameRoundReport, GameSettings, PartySettings, PlayerGuess, Statement } from "@guessera/types";
import Countdown from "./Countdown";
import formatYear from "@/utils/formatYear";
import { ChevronLeft, ChevronRight, Image, ImageOff, Smile } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import calculateScore from "@/utils/calculateScore";
import pickRandomStatements from "@/utils/pickRandomStatements";
import { socket } from "@/utils/socket";

type ArenaProps = {
  gameSettings?: GameSettings;
  partySettings?: PartySettings;
  onRoundEnd?: (report: GameRoundReport) => void;
};

export default function Arena({ onRoundEnd, gameSettings, partySettings }: ArenaProps) {
    // STATES
    const [chosenStatements, setChosenStatements] = useState<Statement[]>([]);
    const [currentStatementIndex, setCurrentStatementIndex] = useState<number>(0);
    const [sliderValue, setSliderValue] = useState<number[]>([1]);
    const [playerGuesses, setPlayerGuesses] = useState<PlayerGuess[]>([]);
    const [score, setScore] = useState<number>(0);
    const [round, setRound] = useState<number>(0); // to reset round timer
    const [loading, setLoading] = useState<boolean>(true); // to render a skeleton while loading
    const [imgError, setImgError] = useState<boolean>(false); // to render a skeleton if image can't be loaded
    const [gameOver, setGameOver] = useState<boolean>(false); // flag to track if player finished their round (in multiplayer mode)

    // REFs
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null); // for smooth hold and press speed increase

    // CONSTANTS
    const currentYear: number = new Date().getFullYear();
    const oldestYear: number = -4999;
    // for slider range labels
    const steps: number = 3;
    const yearLabels: number[] = Array.from({ length: steps }, (_, i) => {
        const value =
        oldestYear + (i * (currentYear - oldestYear)) / (steps - 1);
        return Math.round(value);
    });

    // Handle submit guess
    const handleSubmitGuess = (e?: React.SubmitEvent): void => {
        if (e) e.preventDefault();
        
        // calculate the score
        const calculatedScore = calculateScore(sliderValue[0], Number(chosenStatements[currentStatementIndex].year));
        
        // update score state
        setScore((prevScore) => prevScore + calculatedScore);

        // build guess object for report
        const guessData: PlayerGuess = {
            statementId: chosenStatements[currentStatementIndex].id,
            guessedYear: sliderValue[0],
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
    const moveSliderThumb = (direction: boolean): void => {
        setSliderValue((prev) => {
            const amount = direction === true ? 1 : -1;
            return [
                Math.min(
                    currentYear,
                    Math.max(oldestYear, prev[0] + amount)
                ),
            ];
        });
    };
    // handle pointer (thumb mover button click/touch)
    const handlePointerDown = (direction: boolean) => (e: React.PointerEvent) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        startHolding(direction);
    };
    const handlePointerUp = () => stopHolding();
    // Trigger Hold and Press
    const startHolding = (direction: boolean): void => {
        moveSliderThumb(direction); // act on click immediately

        const startTime = Date.now();
        const tick = () => {
            moveSliderThumb(direction);
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
        // TODO: Move this to the server since this is pretty easily hackable
        if (gameSettings?.mode === "multi" && gameSettings?.statements) {
            setChosenStatements(gameSettings.statements);
            console.log("using shared set");
        } else { // pick 'n' random statements if a statements set doesn't exist (i.e. it's a single player game)
            setChosenStatements(pickRandomStatements(gameSettings?.noOfStatements ?? 5));
        }
    }, []);


  return (
    <div className='flex flex-col justify-between gap-2 size-full lg:w-1/2 bg-background p-2 rounded-xl'>

        {/* Score and Timer */}
        <header className="h-fit flex flex-row-reverse gap-2 justify-between items-start">
            {/* Score */}
            <Item variant="muted" className="max-w-1/3 flex flex-col">
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
                            <Countdown key={round} limit={20} onComplete={handleSubmitGuess} />
                        }
                    </ItemTitle>
                </ItemContent>
            </Item>
        </header>

        {/* Statement section */}
        <section className="flex-1 flex flex-col items-center">
            {gameOver ? (
                <Card className="aspect-video flex-1 flex flex-col justify-center w-full">
                    <CardHeader className="flex flex-col items-center">
                        <Smile />
                        <CardTitle className="text-xl text-center">
                            Round Completed. Waiting for the rest to finish the round.
                        </CardTitle>
                    </CardHeader>
                    
                </Card>
            ) : chosenStatements.length > 0 && currentStatementIndex < chosenStatements.length ? (
                <Card className="flex-1 flex flex-col justify-center relative w-full pt-0">
                    {chosenStatements[currentStatementIndex].img?.trim() ? (
                        <div className="flex-1 relative">
                            {loading && (
                                <Skeleton className="m-2 h-full flex items-center justify-center">
                                    <Image className="text-chart-1 size-16" />
                                </Skeleton>
                            )}
                            {imgError ? (
                                <Skeleton className="m-2 h-full flex items-center justify-center animate-none">
                                    <ImageOff className="text-chart-1 size-16" />
                                </Skeleton>
                            ) : (
                                <img
                                    src={chosenStatements[currentStatementIndex].img}
                                    className={`absolute inset-0 size-full object-cover brightness-60 dark:brightness-40`}
                                    onLoad={() => setLoading(false)}
                                    onError={() => {
                                        setImgError(true);
                                        setLoading(false);
                                    }}
                                />
                            )}
                        </div>
                    ) : (
                        <Skeleton className="m-2 h-full flex items-center justify-center">
                            <ImageOff className="text-chart-1 size-16" />
                        </Skeleton>
                    )}
                    <CardHeader className="h-fit">
                        <CardTitle className="text-xl text-center">{chosenStatements[currentStatementIndex].statement}</CardTitle>
                    </CardHeader>
                </Card>
            ) : (
                <Item className="text-destructive bg-destructive/10 flex flex-col w-fit">Nothing left to guess :(</Item>
            )}
        </section>

        {/* Guess Form section */}
        <section className={`min-h-1/4 flex items-end transition-opacity duration-300 ${gameOver ? "opacity-20 pointer-events-none" : ""}`}>
            <Card className="w-full" size="sm">
                <CardContent>
                <form
                    className="flex flex-col gap-4 h-1/3"
                    onSubmit={handleSubmitGuess}
                >
                    {/* Guess Controls */}
                    <div className="items-start h-14 flex gap-1">
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onPointerDown={handlePointerDown(false)}
                            onPointerUp={handlePointerUp}
                            onPointerLeave={handlePointerUp}
                            onPointerCancel={handlePointerUp}
                        >
                            <ChevronLeft />
                        </Button>
                        <Field className='w-full self-end'>
                            <Slider
                                min={oldestYear}
                                max={currentYear}
                                step={1}
                                value={sliderValue}
                                onValueChange={setSliderValue}
                            />
                            <FieldLabel className='text-muted-foreground uppercase w-full flex justify-between'>
                                {yearLabels.map((year, i) => (
                                <div key={i}>
                                    <span className={`border-r border-muted-foreground h-3 w-0 flex ${
                                        i === 0 ? "mr-auto"
                                        : i === 1 ? "m-auto"
                                        : "ml-auto"
                                    }`}></span>
                                    <span key={i} className="text-xs">
                                        {Math.abs(year)} {year < 0 ? "BCE" : "CE"}
                                    </span>
                                </div>
                                ))}
                            </FieldLabel>
                        </Field>
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onPointerDown={handlePointerDown(true)}
                            onPointerUp={handlePointerUp}
                            onPointerLeave={handlePointerUp}
                            onPointerCancel={handlePointerUp}
                        >
                            <ChevronRight />
                        </Button>
                    </div>

                    <FieldSeparator />

                    <Item variant="muted">
                        <ItemContent>
                            <ItemTitle className="font-bold text-lg">
                                {formatYear(sliderValue[0])}
                            </ItemTitle>
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