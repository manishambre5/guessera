import { useState, useEffect, type ChangeEvent, type SubmitEvent, useRef } from 'react';
import { statements } from './statements';
import Countdown from './Countdown';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

function App() {
  const [statement, setStatement] = useState<string>('');
  const [rangeValue, setRangeValue] = useState<number>(1); // default starting value
  const [score, setScore] = useState<number>(0);
  const [currentWhen, setCurrentWhen] = useState<number | null>(null);
  const currentYear: number = new Date().getFullYear();
  const oldestYear: number = -5000;
  const formRef = useRef<HTMLFormElement>(null);
  const [round, setRound] = useState<number>(0); // to reset round timer
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false); // to pause for a moment after every submit

  
  // for range input labels
  const steps: number = 3;
  const yearLabels: number[] = Array.from({ length: steps }, (_, i) => {
    const value =
      oldestYear + (i * (currentYear - oldestYear)) / (steps - 1);
    return Math.round(value);
  });

  // Helper: pick a random statement and update states
  const pickRandomStatement = (): void => {
    const randomIndex = Math.floor(Math.random() * statements.length);
    setStatement(statements[randomIndex].statement);
    setCurrentWhen(Number(statements[randomIndex].when));
    setRangeValue(1); // reset slider to default or any preferred starting value
    setRound(prev => prev + 1); // increment round to reset timer
    setIsTransitioning(false); //reset transition state for new round
  };

  useEffect(() => {
    pickRandomStatement();
  }, []);

  const handleRangeChange = (e: ChangeEvent<HTMLInputElement>): void => {
    console.log(e.target.value);
    setRangeValue(Number(e.target.value));
  };

  const formatYear = (value: number): string => {
    const num = Number(value);
    // num-1 cauz 256 BCE is mathematically year -255 and there's no year 0 in the BCE-CE scale
    return num < 1 ? `${Math.abs(num-1)} BCE` : `${num} CE`;
  };

  const processGuess = () => {
    if (currentWhen === null || isTransitioning) return;

    //lock UI after a submit
    setIsTransitioning(true);

    //calculate the score
    const distance = Math.abs(rangeValue - currentWhen);
    const maxDistance = 5000;
    const calculatedScore = Math.max(0, maxDistance - distance);
    setScore((prevScore) => prevScore + calculatedScore);
    
    //delay the next round by a moment
    setTimeout(() => {
      pickRandomStatement();
    }, 1000);
  };

  const handleSubmit = (e?: React.SubmitEvent): void => {
    if (e) e.preventDefault();
    processGuess();
  };

  return (
    <main className='flex flex-col gap-2 w-screen h-screen'>
      <header className='flex text-zinc-600 items-center justify-center w-full h-24 bg-zinc-100'>
        <h1 className='text-3xl'>GuessEra</h1>
      </header>

      <section className='card flex flex-col items-center gap-4 h-4/5 size-full'>
        <header className='statement w-full h-3/5 flex flex-col items-center'>
          <div className='flex w-full justify-between items-center gap-2 p-2'>
            <div className='score flex flex-col items-center p-2 font-bold uppercase'>
              <span className=''>Score</span>
              <span className='font-mono text-5xl p-2'>{score}</span>
            </div>
            <Countdown key={round} limit={15} onComplete={processGuess} />
          </div>
          <div className='text-3xl flex items-center justify-center italic text-zinc-100 bg-zinc-800 size-full px-4 py-2'>
            <h1 className=''>{statement}</h1>
          </div>
        </header>
        <section className='guess-slider w-full'>
          <form
            className='flex flex-col items-center justify-around gap-6 h-full w-full md:px-16'
            onSubmit={handleSubmit}
            ref={formRef}
          >
            {/* Scale */}
            <section className='w-full p-2 relative py-4'>
              <input
                type='range'
                className='px-4 range [--range-fill:0] range-xl w-full'
                min={oldestYear}
                max={currentYear}
                step='1'
                value={rangeValue}
                onChange={handleRangeChange}
                disabled={isTransitioning}
              />
              <div className='text-zinc-600 uppercase w-full flex justify-between'>
                {yearLabels.map((year, i) => (
                  <span key={i} className="text-sm">
                    {Math.abs(year)} {year < 0 ? "BCE" : "CE"}
                  </span>
                ))}
              </div>
            </section>

            <div className='join w-full max-w-xs'>
              <div className='join-item bg-zinc-800 text-zinc-100 flex items-center justify-center w-full text-xl'>{formatYear(rangeValue)}</div>
              <button 
                type='submit' 
                disabled={isTransitioning}
                className={`join-item btn btn-lg ${isTransitioning ? 'btn-disabled' : ''}`}
              >
                <ArrowLeft />Submit Guess
              </button>
            </div>
          </form>
        </section>
      </section>
    </main>
  );
}

export default App;
