import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetAdsSponsorQuery } from 'core/services/rtk/AdsServices';
import getNextPage from 'core/utils/getNextPage';
import InfiniteScroll from 'react-infinite-scroll-component';
import SponsorInformation from 'components/sponsor/SponsorInformation';
import SponsorVideo from 'components/sponsor/SponsorVideo';
import getLayouts from 'utils/getLayouts';
import getCredential from 'core/services/helpers/getCredential';
import SSServices from 'core/services/ServerSide/ssServices';

export default function Sponsor() {
  const [page, setPage] = useState(1);
  const [isPlay, setIsPlay] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const { t } = useTranslation();

  const { data: dataSponsor } = useGetAdsSponsorQuery(
    {},
    {
      refetchOnMountOrArgChange: true
    }
  );

  const hasNextPage = () => {
    const pagination = page;
    if (pagination) {
      // const nextPage = getNextPage({ currentPage: pagination, totalData: 12, pageSize: 3 });
      const nextPage = getNextPage({ currentPage: pagination, totalData: 6, pageSize: 3 });
      return nextPage;
    }
  };

  const loadMore = () => {
    if (hasNextPage()) {
      setPage(hasNextPage());
    }
  };

  useEffect(() => {
    const ios = () => {
      if (typeof window === `undefined` || typeof navigator === `undefined`) return false;

      return /iPhone|iPad|iPod/i.test(
        navigator.userAgent ||
          navigator.vendor ||
          (window.opera && opera.toString() === `[object Opera]`)
      );
    };

    if (ios()) {
      setIsMuted(true);
    }
  }, []);

  return (
    <div
      className="flex flex-col space-y-12 overflow-hidden container px-4 space-botttom"
    >
      <SponsorInformation />
      <div className="flex flex-col gap-5">
        <h3 className="text-2xl font-semibold m-0">{t('Sponsor Video')}</h3>
        <InfiniteScroll
          dataLength={20}
          next={loadMore}
          hasMore={hasNextPage()}
          endMessage={
            <p className="flex items-center justify-center w-full my-3">
              <b>{t('Yay! You have seen it all')}</b>
            </p>
          }>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {dataSponsor?.videos
              ?.filter((data) => data?.video_url)
              ?.map((data) => (
                <SponsorVideo
                  video={data?.video_url}
                  title={data?.name}
                  key={data?.id}
                  id={data?.id}
                  mode="feed"
                  playing={isPlay === data?.id}
                  onClickPreview={() => setIsPlay(data?.id)}
                  onPlay={() => setIsPlay(data?.id)}
                  muted={isMuted}
                  light
                />
              ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
}

Sponsor.getLayout = (page, props) => getLayouts(page, 'base', props);

export const getServerSideProps = async ({ req }) => {
  let membershipStatus, config=[], request;
  const { isAuthenticated, token } = getCredential({ req });

  if (isAuthenticated && token) {
    config = [
      SSServices.getAllEvents(),
      SSServices.getMemberships({ token }),
      SSServices.getMyPoints({ token })
    ]; // mandatory for root used
  }

  request = []; // mandatory for this page

  const data = await Promise.all([...config, ...request]);

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
      title: 'Sponsor | Abracadbara Starquest',
      bottomConfig: {
        myPoints: data?.[2] ?? {},
        allEvents: data?.[0] ?? {},
        membershipStatus: membershipStatus ?? {}
      }
    }
  };
};
