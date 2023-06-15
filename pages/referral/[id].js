import React from 'react';
import getLayouts from 'utils/getLayouts';
import { useRouter } from 'next/router';
import { setReferralCode } from 'core/redux/reducers/authenticationSlice';
import { useDispatch } from 'react-redux';
import { setCookie } from 'cookies-next';
import Head from 'next/head';
import SSServices from 'core/services/ServerSide/ssServices';
import getCredential from 'core/services/helpers/getCredential';
import parse from 'html-react-parser';

export default function Referral(props) {
  const router = useRouter();
  const dispatch = useDispatch();
  const seo = props?.seo;

  React.useEffect(() => {
    if (router.query?.id) {
      dispatch(setReferralCode(router.query?.id));
      setCookie('referral', router?.query?.id, { maxAge: 60 * 6 * 24 });
      setCookie('openSignIn', true, { maxAge: 60 * 6 * 24 });
      setTimeout(() => {
        router.replace('/');
      }, 2000);
    }
  }, [router]);

  return (
    <>
      <Head>
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
      <div className="flex justify-center items-center h-screen blank-screen">
        {/* <Loader /> */}
        Loading...
      </div>
    </>
  );
}

Referral.getLayout = (page, props) => getLayouts(page, 'base', props);

export const getServerSideProps = async ({ req }) => {
  let membershipStatus, config = [], request, global;
  const { isAuthenticated, token } = getCredential({ req });

  global = [SSServices.getSeo({ path: '/' })];

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
      title: 'Referral | Abracadbara Starquest',
      seo: data?.[0] || [],
      bottomConfig: {
        myPoints: data?.[3] ?? {},
        allEvents: data?.[1] ?? {},
        membershipStatus: membershipStatus ?? {}
      }
    }
  };
};
