import PodiumMostVoted from 'components/winners/PodiumMostVoted';
import LuckyDrawWinner from 'components/winners/LuckyDrawWinner';
import MostPointWinner from 'components/winners/MostPointWinner';
import OpeningActWinner from 'components/winners/OpeningActWinner';
import Podium from 'components/winners/Podium';
import TheWinnersAre from 'components/winners/TheWinnersAre';
import getLayouts from 'utils/getLayouts';
import SelectorPerformerWinner from 'components/winners/SelectorPerformerWinner';
import SSServices from 'core/services/ServerSide/ssServices';
import getCredential from 'core/services/helpers/getCredential';

export default function Winners(props) {
  const dataEvents = props?.data;

  return (
    <div className="flex flex-col space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 space-y-5 md:space-y-2 space-x-0 md:space-x-5">
        <Podium
          title="Players with the most points"
          eventId={dataEvents?.data?.data[0]?.id || dataEvents?.last_event?.id}
        />
        <PodiumMostVoted
          title="Videos with the most votes"
          eventId={dataEvents?.data?.data[0]?.id || dataEvents?.last_event?.id}
        />
      </div>
      <TheWinnersAre />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
        <SelectorPerformerWinner
          eventId={dataEvents?.data?.data[0]?.id || dataEvents?.last_event?.id}
        />
        <OpeningActWinner eventId={dataEvents?.data?.data[0]?.id || dataEvents?.last_event?.id} />
        <MostPointWinner eventId={dataEvents?.data?.data[0]?.id || dataEvents?.last_event?.id} />
        <LuckyDrawWinner eventId={dataEvents?.data?.data[0]?.id || dataEvents?.last_event?.id} />
      </div>
    </div>
  );
}

Winners.getLayout = (page, props) => getLayouts(page, 'base', props);

export const getServerSideProps = async ({ req }) => {
  let membershipStatus,
    protecteds = [],
    global;
  const { isAuthenticated, token } = getCredential({ req });
  global = [SSServices.getAllEvents()]; // mandatory for this page

  if (isAuthenticated && token) {
    protecteds = [SSServices.getMemberships({ token }), SSServices.getMyPoints({ token })]; // mandatory for root used
  }

  const data = await Promise.all([...global, ...protecteds]);

  // if (
  //   data[0]?.data &&
  //   data?.[0]?.data?.data?.[0]?.current_contest &&
  //   data?.[0]?.data?.data?.[0]?.memberships && token
  // ) {
  //   membershipStatus = await SSServices.getMembershipsStatus({
  //     token,
  //     datas: {
  //       event_contest_id: parseInt(data?.[0]?.data?.data?.[0]?.current_contest?.id),
  //       membership_id: parseInt(data?.[0]?.data?.data?.[0]?.memberships?.[0]?.id)
  //     }
  //   });
  // }

  return {
    props: {
      title: 'Contestant Winner | Abracadbara Starquest',
      data: data?.[0],
      bottomConfig: {
        myPoints: data?.[2] ?? {},
        allEvents: data?.[0] ?? {},
        membershipStatus: membershipStatus ?? {}
      }
    }
  };
};
