import React from 'react';
import ContentPrivacyPolicy from 'components/support/ContentPrivacyPolicy';
import HeaderSupport from 'components/support/HeaderSupport';
import getLayouts from 'utils/getLayouts';
import service from 'core/services/publicService';
import SSServices from 'core/services/ServerSide/ssServices';
import getCredential from 'core/services/helpers/getCredential';

export default function PrivacyPolicy({ privacyPolicy }) {
  return (
    <div className="flex flex-col space-y-8 md:space-y-12 break-words">
      <HeaderSupport />
      <ContentPrivacyPolicy content={privacyPolicy} />
    </div>
  );
}

PrivacyPolicy.getLayout = (page, props) => getLayouts(page, 'base', props);

export async function getServerSideProps({ req, locale }) {
  const privacyPolicy = await service.get(`/concurrent/privacy-policy?language=${locale}`);

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
      title: 'Official Rules | Abracadbara Starquest',
      privacyPolicy: privacyPolicy?.data?.data,
      bottomConfig: {
        myPoints: data?.[2] ?? {},
        allEvents: data?.[0] ?? {},
        membershipStatus: membershipStatus ?? {}
      }
    }
  };
}
