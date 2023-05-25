import { useEffect, useState } from 'react';
import LocalStorage from '../lib/LocalStorage';

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
      const user = LocalStorage.get('user');
      const toJson = user;

      // const groupRank = groupByKey(candidate, 'total_points');
      // console.log('group rank', groupRank);
      const listWinner = candidate?.map((item, i) => {
        const myData = item.user_id === toJson?.id;
        return { ...item, rank: i + 1, my_data: myData };
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

// const [rank, setRank] = useState();
// const groupByKey = (array, key) => array
//   .reduce((hash, obj) => {
//     if (obj[key] === undefined) return hash;
//     // console.log(obj[key]);
//     // return Object.assign(hash, { [obj[key]]: (hash[obj[key]] || []).concat(obj) });
//     return obj[key];
//   }, {});

// useEffect(() => {
//   const listWinner = winner?.map((item, i) => {
//     const myData = item.user_id === 19;
//     return { ...item, rank: i + 1, my_data: myData };
//   });
//   // const groupPoint = winner?.reduce((item) => item.total_points);
//   // console.log('group point ', groupPoint);

//   const groupPoint = groupByKey(winner, 'total_points');
//   console.log('Group Point : ', groupPoint);
// }, [winner]);
