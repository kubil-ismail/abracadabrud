import { useEffect, useState } from 'react';

export default function useCountDown(integer) {
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

  const startFromZero = () => {
    setTimer(0);
  };

  return {
    timer,
    setTimer,
    resetTimer,
    startFromZero
  };
}
