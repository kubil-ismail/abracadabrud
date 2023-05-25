import { useEffect, useState } from 'react';

const useCountDownByDate = () => {
  const [countDown, setCountDown] = useState();
  const [dateTarget, setDateTarget] = useState();

  const convertLabel = (wkt) => {
    const days = Math.floor(wkt / (1000 * 60 * 60 * 24));
    const hours = Math.floor((wkt % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((wkt % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((wkt % (1000 * 60)) / 1000);
    const label = `${hours}:${minutes}:${seconds}`;
    if (days + hours + minutes + seconds <= 0) {
      setCountDown('Expired');
    } else if (days + hours + minutes + seconds > 0) {
      setCountDown(label);
    } else {
      setCountDown('00:00:00');
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const wkt = dateTarget - new Date().getTime();
      convertLabel(wkt);
    }, 1000);
    return () => clearInterval(interval);
  }, [dateTarget]);

  return {
    countDown,
    setDateTarget
  };
};

export default useCountDownByDate;
