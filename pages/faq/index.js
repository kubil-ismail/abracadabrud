import HowToWinFaq from 'components/faq/HowToWinFaq';
import HowToCollectPoint from 'components/faq/HowToCollectPoint';
import HowToSubmitVideo from 'components/faq/HowToSubmitVideo';
import PerformAtWepop from 'components/faq/PerformAtWepop';
import Points from 'components/faq/Points';
import RulesFaq from 'components/faq/RulesFaq';
import WaysGetPoint from 'components/faq/WaysGetPoint';
import WhatIsFaq from 'components/faq/WhatIsFaq';
import WinAwesomePrize from 'components/faq/WinAwesomePrize';
import BenefitMembership from 'components/upgrade-membership/BenefitMembership';
import getLayouts from 'utils/getLayouts';
import getCredential from 'core/services/helpers/getCredential';
import SSServices from 'core/services/ServerSide/ssServices';
import React from 'react';
import { useRouter } from 'next/router';
import EveryWeekWinner from 'components/faq/EveryWeekWinner';
import UsePointToVote from 'components/faq/UsePointToVote';
import { useGetEventMembershipQuery } from 'core/services/rtk/MembershipServices';
import BuyPoints from 'components/faq/BuyPoints';
import ExtraPoints from 'components/faq/ExtraPoints';
import { setAllEvents } from 'core/redux/reducers/globalSlice';
import { useDispatch } from 'react-redux';
import Head from 'next/head';
import parse from 'html-react-parser';

export default function Faq(props) {
  const router = useRouter();
  const dispatch = useDispatch();
  const all_events = props?.bottomConfig?.allEvents;
  const seo = props?.seo;

  React.useEffect(() => {
    if (all_events) {
      dispatch(setAllEvents(all_events));
    }
  }, [all_events]);

  React.useEffect(() => {
    setTimeout(() => {
      if (router?.asPath === '/faq#memberships') {
        router.push('#memberships');
      }
    }, 1000);
  }, []);

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
      <div className="flex flex-col space-y-5">
        <WhatIsFaq />
        <WinAwesomePrize />
        {/* <HowToWinFaq /> */}
        <EveryWeekWinner />
        <UsePointToVote />
        <HowToCollectPoint />
        <WaysGetPoint />
        <Points />
        <PerformAtWepop />
        <HowToSubmitVideo />
        <RulesFaq />
        <div id="memberships"></div>
        <div className="flex flex-col gap-6">
          <BenefitMembership {...props} />
        </div>
        {/* <BuyPoints {...props} /> */}
        <ExtraPoints {...props} />
      </div>
    </>
  );
}

Faq.getLayout = (page, props) => getLayouts(page, 'base', props);

export const getServerSideProps = async ({ req }) => {
  let props = {
    authenticated: false,
    memberships: []
  };

  let membershipStatus,
    eventMembership,
    config = [],
    request = [],
    seo;
  const { isAuthenticated, token } = getCredential({ req });

  request = [SSServices.getAllEvents()]; // mandatory for this page
  seo = await SSServices.getSeo({ path: '/faq' });

  if (isAuthenticated && token) {
    config = [SSServices.getMemberships({ token }), SSServices.getMyPoints({ token })]; // mandatory for root used

    props = { ...props, authenticated: true };
  }

  const data = await Promise.all([...request, ...config]);

  if (
    ((data[0]?.data &&
      data?.[0]?.data?.data?.[0]?.current_contest &&
      data?.[0]?.data?.data?.[0]?.memberships) ??
      (data?.[0]?.last_event?.event_contest_id &&
        data?.[0]?.last_event?.membership?.id)) &&
    token
  ) {
    props = { ...props, memberships: data[1] };
    membershipStatus = await SSServices.getMembershipsStatus({
      token,
      datas: {
        event_contest_id: parseInt(data?.[0]?.data?.data?.[0]?.current_contest?.id ?? data?.[0]?.last_event?.event_contest_id),
        membership_id: parseInt(data?.[0]?.data?.data?.[0]?.memberships?.[0]?.id ?? data?.[0]?.last_event?.membership?.id)
      }
    });
  }

  return {
    props: {
      ...props,
      title: 'FAQ | Abracadbara Starquest',
      seo: seo ?? {},
      bottomConfig: {
        myPoints: data?.[2] ?? {},
        allEvents: data?.[0] ?? {},
        membershipStatus: membershipStatus ?? {}
      }
    }
  };
};
