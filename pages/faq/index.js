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

export default function Faq(props) {
  const router = useRouter();

  React.useEffect(() => {
    setTimeout(() => {
      if (router?.asPath === '/faq#memberships') {
        router.push('#memberships');
      }
    }, 1000);
  }, []);

  return (
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
      <BuyPoints {...props} />
    </div>
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
    request = [];
  const { isAuthenticated, token } = getCredential({ req });

  request = [SSServices.getAllEvents()]; // mandatory for this page

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
      bottomConfig: {
        myPoints: data?.[2] ?? {},
        allEvents: data?.[0] ?? {},
        membershipStatus: membershipStatus ?? {}
      }
    }
  };
};
