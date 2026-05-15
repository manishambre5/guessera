import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Item, ItemActions, ItemContent, ItemHeader, ItemTitle } from "./ui/item";
import { Field, FieldLabel, FieldSeparator } from "./ui/field";
import { Slider } from "./ui/slider";
import { statements } from "@/statements";
import { Button } from "./ui/button";
import type { Statement } from "@/types";
import Countdown from "./Countdown";

type PlayRoundProps = {
  mode: "single" | "multi";
  difficulty?: "easy" | "medium" | "hard";
  onRoundEnd?: (report: { finalScore: number }) => void;
};

export default function PlayRound({ onRoundEnd }: PlayRoundProps) {
    // STATES
    const [chosenStatements, setChosenStatements] = useState<Statement[]>([]);
    const [currentStatementIndex, setCurrentStatementIndex] = useState<number>(0);
    const [sliderValue, setSliderValue] = useState<number[]>([1]);
    const [score, setScore] = useState<number>(0);
    const [round, setRound] = useState<number>(0); // to reset round timer

    // CONSTANTS
    const currentYear: number = new Date().getFullYear();
    const oldestYear: number = -5000;
    // for slider range labels
    const steps: number = 3;
    const yearLabels: number[] = Array.from({ length: steps }, (_, i) => {
        const value =
        oldestYear + (i * (currentYear - oldestYear)) / (steps - 1);
        return Math.round(value);
    });

    // To format year (-1000 --> ~1000BCE)
    const formatYear = (value: number): string => {
        const num = Number(value);
        // num-1 cauz 256 BCE is mathematically year -255 and there's no year 0 in the BCE-CE scale
        return num < 1 ? `${Math.abs(num)} BCE` : `${num} CE`;
    };

    // Handle submit guess
    const handleSubmitGuess = (e?: React.SubmitEvent): void => {
        if (e) e.preventDefault();

        console.log(sliderValue[0]);
        console.log(chosenStatements[currentStatementIndex].year);
        
        // calculate the score
        const calculatedScore = calculateScore(sliderValue[0], Number(chosenStatements[currentStatementIndex].year));
        
        // update score state
        setScore((prevScore) => prevScore + calculatedScore);

        // check if last statement reached
        if (currentStatementIndex < chosenStatements.length - 1) {
            setRound(prev => prev + 1); // increment round to reset timer
            setCurrentStatementIndex((prev) => prev + 1);// go to next statement
        } else {
            if (onRoundEnd) {
                onRoundEnd({
                    finalScore: (score || 0) + calculatedScore,
                }); // end round and send final score back to parent
            }
        }
    };

    // Score calculation logic
    function calculateScore(guess: number, actual: number): number {
        const maxDifference = 2000;
        const maxScore = 1000;
        const difference = Math.abs(guess - actual);

        if (difference >= maxDifference) return 0;

        // exponential scoring to reward close guesses well
        const normalized = 1 - difference / maxDifference; // 1.0 perfect, 0.0 at maxDiff
        const result = Math.round(maxScore * Math.pow(normalized, 3)); // cubic/exponential curve

        return result;
    }


    useEffect(() => {
        // pick 'n' random statements
        const pickRandomStatements = (n: number): Statement[] => {
            const chosenStatements = [];
            const usedIndices = new Set();
            while (chosenStatements.length < n) {
                const randomIndex = Math.floor(Math.random() * statements.length);
                if (!usedIndices.has(randomIndex)) {
                    usedIndices.add(randomIndex);
                    chosenStatements.push(statements[randomIndex]);
                }
            }
            return chosenStatements;
        }

        setChosenStatements(pickRandomStatements(5));
    }, []);


  return (
    <div className='flex flex-col justify-around gap-2 w-full md:w-1/2 h-screen'>

        {/* Score and Timer */}
        <header className="h-1/5 flex gap-2 justify-between items-start">
            {/* Score */}
            <Item variant="outline" className="w-1/3 flex flex-col">
                <ItemHeader className="">SCORE</ItemHeader>
                <ItemContent>
                    <ItemTitle className="text-2xl">{score}</ItemTitle>
                </ItemContent>
            </Item>

            {/* Timer */}
            <Item variant="outline" className="w-1/3 flex flex-col">
                <ItemHeader className="">TIME LEFT</ItemHeader>
                <ItemContent>
                    <ItemTitle className="text-2xl">
                        <Countdown key={round} limit={15} onComplete={handleSubmitGuess} />
                    </ItemTitle>
                </ItemContent>
            </Item>
        </header>

        {/* Statement section */}
        <section className="p-2 h-1/4 flex items-center">
            {chosenStatements.length > 0 && currentStatementIndex < chosenStatements.length ? (
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="text-xl text-center">{chosenStatements[currentStatementIndex].statement}</CardTitle>
                    </CardHeader>
                </Card>
                ) : (
                    <span>game over.</span>
                )}
        </section>

        {/* Guess Form section */}
        <section className="h-1/3 flex items-end">
            <Card className="w-full">
                <CardContent>
                <form
                    className="flex flex-col gap-4 h-1/3"
                    onSubmit={handleSubmitGuess}
                >
                    {/* Scale */}
                    <Field className='w-full'>
                        <Slider
                            min={oldestYear}
                            max={currentYear}
                            step={1}
                            defaultValue={[1]}
                            onValueChange={setSliderValue}
                        />
                        <FieldLabel className='text-zinc-600 uppercase w-full flex justify-between'>
                            {yearLabels.map((year, i) => (
                            <span key={i} className="text-sm">
                                {Math.abs(year)} {year < 0 ? "BCE" : "CE"}
                            </span>
                            ))}
                        </FieldLabel>
                    </Field>

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
                                //disabled={isTransitioning}
                                //className={`join-item btn btn-lg ${isTransitioning ? 'btn-disabled' : ''}`}
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