import Head from 'next/head';
import getLayouts from '../utils/getLayouts';
import BannerEvent from 'components/event/Banner';
import ExploreVideo from '../components/dashboard/ExploreVideo';
import ContinuePayModal from '../components/upload-video/ContinuePayModal';
import SSServices from 'core/services/ServerSide/ssServices';
import getCredential from 'core/services/helpers/getCredential';
import VideoInfographic from 'components/dashboard/VideoInfographic';
import { setMemberships } from 'core/redux/reducers/membershipsSlice';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { useDispatch, useSelector } from 'react-redux';
import { setModal } from 'core/redux/reducers/modalSlice';
import { pointApi } from 'core/services/rtk/MeServices';
import { useEffect } from 'react';
import { setRequiredToEnroll } from 'core/redux/reducers/globalSlice';
import { setAllEvents } from 'core/redux/reducers/globalSlice';
import { setFtvProfile } from 'core/redux/reducers/authenticationSlice';
import service from 'core/services/publicService';
import CardInfographic from 'components/element/CardInfographic';
import parse from 'html-react-parser';

export default function Home(props) {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.authentication);
  const [seo, all_events] = props?.data ?? [];
  const memberships = props?.data?.[2] ?? [];
  const required_to_enroll = props?.data?.[3]?.required_to_enroll ?? false;

  useEffect(() => {
    dispatch(setMemberships(memberships));
    if (memberships?.length > 0) {
      dispatch(pointApi.util.invalidateTags(['Points']));
    }
  }, [memberships]);

  useEffect(() => {
    if (required_to_enroll === true || required_to_enroll === false) {
      dispatch(setRequiredToEnroll(required_to_enroll));
    }
  }, [required_to_enroll]);

  useEffect(() => {
    if (all_events) {
      dispatch(setAllEvents(all_events));
    }
  }, [all_events]);

  useEffect(() => {
    const isOpen = getCookie('openSignIn');
    if (isOpen && !user) {
      dispatch(setModal({ name: 'modalRegister', value: true }));

      setTimeout(() => {
        deleteCookie('openSignIn');
      }, 2000);
    }
  }, [user]);

  return (
    <>
      <Head>
        <title>{seo?.title}</title>
        <meta name="description" content={parse(seo?.description)} />
        <meta name="keywords" content={seo?.keyword} />
        <meta name="author" content={seo?.author} />
        <meta name="robots" content={seo?.robots} />
        {/* og */}
        <meta property="og:title" content={seo?.title} />
        <meta property="og:description" content={parse(seo?.description)} />
        <meta property="og:image" content={seo?.image} />
        <meta property="og:url" content={seo?.url} />
        {/* twitter_card */}
        <meta name="twitter:card" content={seo?.twitter_card} />
        <meta name="twitter:creator" content={seo?.twitter_creator} />
        <meta name="twitter:site" content={seo?.twitter_site} />
        <meta name="twitter:title" content={seo?.title} />
        <meta name="twitter:description" content={parse(seo?.description)} />
        <meta name="twitter:image" content={seo?.image} />
        {/* fb */}
        <meta property="fb:app_id" content={seo?.fb_app_id} />
      </Head>
      <div className="flex flex-col space-y-5 md:space-y-12">
        <CardInfographic />
        <BannerEvent />
        <VideoInfographic />
        <ContinuePayModal />
        <ExploreVideo />
      </div>
    </>
  );
}

export const getServerSideProps = async ({ req, res }) => {
  let global,
    membershipStatus,
    protecteds = [];
  const { isAuthenticated, token } = getCredential({ req });

  global = [SSServices.getSeo({ path: '/' }), SSServices.getAllEvents()];

  if (isAuthenticated && token) {
    protecteds = [
      SSServices.getMemberships({ token }),
      SSServices.getRequiredToEnroll({ token }),
      SSServices.getMyPoints({ token }) // for bottom navigation
    ];
  }

  const data = await Promise.all([...global, ...protecteds]);

  // if (
  //   data[1]?.data &&
  //   data?.[1]?.data?.data?.[0]?.current_contest &&
  //   data?.[1]?.data?.data?.[0]?.memberships
  // ) {
  //   membershipStatus = await SSServices.getMembershipsStatus({
  //     token
  //   });
  // }

  return {
    props: {
      data,
      seo: data?.[0] || [],
      title: 'Abracadbara Starquest | Connecting fans, bands, and brands',
      bottomConfig: {
        myPoints: data?.[4] ?? {},
        allEvents: data?.[1] ?? {},
        membershipStatus: membershipStatus ?? {}
      }
    }
  };
};

Home.getLayout = (page, props) => getLayouts(page, 'base', props);
