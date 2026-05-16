import { useEffect, useState } from "react";

type CountdownProps = {
  limit: number;
  onComplete?: () => void;
};

const Countdown = ({ limit, onComplete }: CountdownProps) => {
  const [counter, setCounter] = useState(limit);

  useEffect(() => {
    setCounter(limit);
  }, [limit]);

  useEffect(() => {
    if (counter <= 0) return;

    const interval = setInterval(() => {
      setCounter((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [counter]);

  useEffect(() => {
    if (counter === 0) {
        const timeout = setTimeout(() => {
            onComplete?.();
        }, 1000);
        return () => clearTimeout(timeout);
    }
  }, [counter, onComplete]);

  return (
    <span className="">
      <span
        className={counter <= 5 && counter > 0 ? "text-destructive" : ""}
        aria-live="polite"
        aria-label={String(counter)}
      >
        {counter}
      </span>
    </span>
  );
};

export default Countdown;