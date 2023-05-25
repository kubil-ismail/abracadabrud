import { useEffect, useState } from 'react';
// import LocalStorage from '../lib/LocalStorage';

export default function useRanking() {
  const [candidate, setCandidate] = useState();
  const [rank, setRank] = useState([]);
  // const groupByKey = (array, key) => array
  //   .reduce((hash, obj) => {
  //     const gp = [];
  //     if (obj[key] === undefined) return hash;
  //     return Object.assign(hash, { [obj[key]]: (hash[obj[key]] || []).concat(obj) });
  //   }, {});

  useEffect(() => {
    if (candidate) {
      // const user = LocalStorage.get('user');
      // const toJson = user;
      const listWinner = candidate?.map((item, i) => {
        // const myData = item.user_id === toJson?.id;
        const myData = false;
        const votes = item?.votes ? item?.votes : 0;
        return {
          ...item,
          rank: i + 1,
          my_data: myData,
          votes
        };
      });
      setRank(listWinner);
    }
  }, [candidate]);

  return {
    rank,
    setRank,
    setCandidate
  };
}
