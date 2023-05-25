import ContentTermsOfService from 'components/support/ContentTermsOfService';
import HeaderSupport from 'components/support/HeaderSupport';
import SSServices from 'core/services/ServerSide/ssServices';
import getCredential from 'core/services/helpers/getCredential';
import getLayouts from 'utils/getLayouts';

export default function TermsOfService({ termsOfService }) {
  return (
    <div className="flex flex-col space-y-8 md:space-y-12 overflow-hidden">
      <HeaderSupport />
      <ContentTermsOfService content={termsOfService} />
    </div>
  );
}

TermsOfService.getLayout = (page, props) => getLayouts(page, 'base', props);

export async function getServerSideProps({ locale, req }) {
  const termsOfService = await SSServices.getConcurrent(`terms-of-service?language=${locale}`);

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
      termsOfService,
      title: 'Terms of service | Abracadbara Starquest',
      bottomConfig: {
        myPoints: data?.[2] ?? {},
        allEvents: data?.[0] ?? {},
        membershipStatus: membershipStatus ?? {}
      }
    }
  };
}
