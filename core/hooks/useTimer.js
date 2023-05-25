import { useEffect, useState } from 'react';

export default function useTimer(integer) {
  const [timer, setTimer] = useState(integer);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(timer - 1);
      if (timer === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [timer]);

  const resetTimer = () => {
    setTimer(integer);
  };

  return {
    timer,
    setTimer,
    resetTimer
  };
}
