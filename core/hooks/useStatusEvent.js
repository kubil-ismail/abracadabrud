import { useEffect, useState } from 'react';
import moment from 'moment';

const useCountDownByWeek = () => {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [statusEvent, setStatusEvent] = useState();

  useEffect(() => {
    if (moment().isBetween(startDate, endDate)) {
      setStatusEvent('ON GOING');
    } else if (moment(startDate).isAfter()) {
      setStatusEvent('COMING SOON');
    } else {
      setStatusEvent('FINISH');
    }
  }, [startDate, endDate]);

  return {
    statusEvent,
    setStartDate,
    setEndDate
  };
};

export default useCountDownByWeek;
