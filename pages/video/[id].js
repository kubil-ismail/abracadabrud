// import { useGetShowVideoQuery } from 'core/services/rtk/MembershipsServices';
import { useRouter } from 'next/router';
import { setCookie } from 'cookies-next';
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useGetShowVideoQuery } from 'core/services/rtk/EventServices';
import { setReferralCode } from 'core/redux/reducers/authenticationSlice';
import getLayouts from 'utils/getLayouts';
import CardVideo from 'components/element/CardVideo';
import getCredential from 'core/services/helpers/getCredential';
import SSServices from 'core/services/ServerSide/ssServices';
import Head from 'next/head';

export default function Video(props) {
  const { seo } = props;
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.authentication);
  const [commentCount, setCommentCount] = useState(0);
  const [voteCount, setVoteCount] = useState(0);

  useEffect(() => {
    if (seo) {
      setVoteCount(seo?.video?.votes);
      setCommentCount(seo?.video?.comments_count);
    }
  }, []);

  useEffect(() => {
    if (router?.query?.referral) {
      dispatch(setReferralCode(router.query?.referral));
      setCookie('referral', router.query?.referral, { maxAge: 60 * 6 * 24 });
      setCookie('openSignIn', true, { maxAge: 60 * 6 * 24 });
    }
  }, [router, isAuthenticated]);

  return (
    <>
      <Head>
        {/* <title>{seo?.video?.caption}</title> */}
        <meta name="description" content={seo?.video?.caption} />
        <meta
          property="og:title"
          content={`${seo?.video?.caption} - ${seo?.video?.user?.contestant?.artist_band_name}`}
        />
        <meta
          property="og:description"
          content={`
          Check out abracadabra, a cool new music platform where Indonesian performers are competing to perform as the opening act at the wePOP concert. You can upload your music video, vote for other videos, and win amazing prizes.
        `}
        />
        <meta property="og:image" content={seo?.video?.thumbnails[0]?.thumbnail} />

        {/* twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        {/* <meta name="twitter:site" content="@abracadabra" />
        <meta name="twitter:creator" content="@abracadabra" /> */}
        <meta
          name="twitter:title"
          content={`${seo?.video?.caption} - ${seo?.video?.user?.contestant?.artist_band_name}`}
        />
        <meta
          name="twitter:description"
          content={`
          Check out abracadabra, a cool new music platform where Indonesian performers are competing to perform as the opening act at the wePOP concert. You can upload your music video, vote for other videos, and win amazing prizes.
        `}
        />
        <meta name="twitter:image" content={seo?.video?.thumbnails[0]?.thumbnail} />
      </Head>
      <div className="grid grid-cols-1">
        <div className="md:col-span-2">
          <CardVideo
            username={seo?.video?.user?.username}
            bandName={seo?.video?.user?.contestant?.artist_band_name ?? seo?.video?.user?.name}
            photo={seo?.video?.user?.photo}
            videoId={seo?.video?.thumbnails[0]?.video_id}
            videoUrl={seo?.video?.video_url}
            userId={seo?.video?.user_id}
            caption={seo?.video?.caption}
            date={seo?.video?.created_at}
            totalFavorite={0}
            totalComment={commentCount}
            totalVote={voteCount}
            height="h-[191px] md:h-[400px]"
            current={seo?.video}
            isDetail
          />
        </div>
      </div>
    </>
  );
}

// getServersideProps
export async function getServerSideProps({ query, req }) {
  const { id } = query;

  let membershipStatus,
    config = [],
    request,
    global;
  const { isAuthenticated, token } = getCredential({ req });

  global = [SSServices.getShowVideo(id)];

  if (isAuthenticated && token) {
    config = [
      SSServices.getAllEvents(),
      SSServices.getMemberships({ token }),
      SSServices.getMyPoints({ token })
    ]; // mandatory for root used
  }

  request = []; // mandatory for this page

  const data = await Promise.all([...global, ...config, ...request]);

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
      seo: data[0]?.data ?? {},
      title: `${data[0]?.data?.video?.caption ?? 'Video Detail'} | Abracadabra Starquest`,
      bottomConfig: {
        myPoints: data?.[3] ?? {},
        allEvents: data?.[1] ?? {},
        membershipStatus: membershipStatus ?? {}
      }
      // data: data
    }
  };
}

Video.getLayout = (page, props) => getLayouts(page, 'base', props);
