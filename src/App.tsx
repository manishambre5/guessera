import { useState, useEffect, type ChangeEvent, type SubmitEvent } from 'react';
import { statements } from './statements';

function App() {
  const [statement, setStatement] = useState<string>('');
  const [rangeValue, setRangeValue] = useState<string>('1'); // default starting value
  const [score, setScore] = useState<number>(0);
  const [currentWhen, setCurrentWhen] = useState<number | null>(null);

  // Helper: pick a random statement and update states
  const pickRandomStatement = () => {
    const randomIndex = Math.floor(Math.random() * statements.length);
    setStatement(statements[randomIndex].statement);
    setCurrentWhen(Number(statements[randomIndex].when));
    setRangeValue('1'); // reset slider to default or any preferred starting value
  };

  useEffect(() => {
    pickRandomStatement();
  }, []);

  const handleRangeChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setRangeValue(e.target.value);
  };

  const formatYear = (value: number | string): string => {
    const num = Number(value);
    return num < 0 ? `${Math.abs(num)} BCE` : `${num} CE`;
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (currentWhen === null) return;

    const guessNum = Number(rangeValue);
    const distance = Math.abs(guessNum - currentWhen);

    const maxDistance = 5000;
    const calculatedScore = Math.max(0, maxDistance - distance);

    setScore((prevScore) => prevScore + calculatedScore);

    // Pick next statement immediately after scoring current guess
    pickRandomStatement();
  };

  return (
    <main className='flex flex-col gap-4 w-screen h-screen p-2'>
      <header className='flex text-slate-500 items-center justify-center w-full h-1/6'>
        <h1 className='text-5xl'>GuessEra</h1>
      </header>
      <section className='card flex flex-col items-center justify-center gap-16 h-4/5 size-full'>
        <header className='statement w-full h-1/2 flex items-center justify-center'>
          <h1 className='text-4xl text-center italic'>{statement}</h1>
        </header>
        <section className='guess-slider w-full h-1/2'>
          <form
            className='flex flex-col items-center justify-around gap-6 h-full w-full px-4 md:px-16'
            onSubmit={handleSubmit}
          >
            <div className='text-xl'>{formatYear(rangeValue)}</div>
            <input
              type='range'
              className='range [--range-fill:0] w-full'
              min='-5000'
              max='2025'
              step='1'
              value={rangeValue}
              onChange={handleRangeChange}
            />
            <button
              type='submit'
              className='btn btn-lg'
            >
              Submit Guess
            </button>
          </form>
        </section>
        <div className='score text-3xl font-bold mt-4'>
          Score: {score}
        </div>
      </section>
      <footer></footer>
    </main>
  );
}

export default App;
