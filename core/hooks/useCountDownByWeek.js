import { useEffect, useState } from 'react';
import moment from 'moment';

const useCountDownByWeek = () => {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [statusEvent, setStatusEvent] = useState();

  const [countDown, setCoutDown] = useState({
    days: '00',
    dayHours: '00',
    hours: '00',
    minutes: '00',
    seconds: '00'
  });
  const getDateWeek = moment().isoWeekday(5);
  // eslint-disable-next-line no-unused-vars
  const lastWeek = moment(getDateWeek).set({
    hours: 23,
    minutes: 59,
    seconds: 59
  });
  const addNol = (num) => (num < 10 ? `0${num}` : num);

  useEffect(() => {
    if (statusEvent === 'ON GOING') {
      const interval = setInterval(() => {
        // const wkt = lastWeek - moment();
        const wkt = moment(endDate) - moment();
        const days = Math.floor(wkt / (1000 * 60 * 60 * 24));
        const hours = Math.floor((wkt / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((wkt % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((wkt % (1000 * 60)) / 1000);
        const dayHours = days * 24;
        setCoutDown({
          days: addNol(days),
          dayHours: addNol(dayHours),
          hours: addNol(hours),
          minutes: addNol(minutes),
          seconds: addNol(seconds)
        });
      }, 1000);
      return () => clearInterval(interval);
    }
    return setCoutDown({
      days: '00',
      dayHours: '00',
      hours: '00',
      minutes: '00',
      seconds: '00'
    });
  }, [statusEvent]);

  useEffect(() => {
    // console.log('start date', startDate);
    // console.log('end date', endDate);
    // const now = moment().format('YYYY-MM-DD HH:mm:ss');
    // const start = moment(startDate).set({ hours: '00', minutes: '00', seconds: '01' }).format('YYYY-MM-DD HH:mm:ss');
    // const end = moment(endDate).set({ hours: '23', minutes: '59', seconds: '59' }).format('YYYY-MM-DD HH:mm:ss');
    // const isCurrent = moment(now).isBetween(start, end);
    if (moment().isBetween(startDate, endDate)) {
      setStatusEvent('ON GOING');
    } else if (moment(startDate).isAfter()) {
      setStatusEvent('COMING SOON');
    } else {
      setStatusEvent('FINISH');
    }
  }, [startDate, endDate]);

  return {
    countDown,
    statusEvent,
    setStartDate,
    setEndDate
  };
};

export default useCountDownByWeek;
