import SurveyQuestions from 'components/my-account/SurveyQuestions';
import SSServices from 'core/services/ServerSide/ssServices';
import getCredential from 'core/services/helpers/getCredential';
import { useTranslation } from 'react-i18next';
import getLayouts from 'utils/getLayouts';

export default function SurveyQuestion({ officialRules }) {
    const { t } = useTranslation()

  return (
    <div className="flex flex-col space-y-8 md:space-y-12 min-h-screen">
        <h3 className="text-3xl font-bold text-slate-50">{t('Survey Question')}</h3>
        <SurveyQuestions />
    </div>
  );
}

SurveyQuestion.getLayout = (page, props) => getLayouts(page, 'base', props);

export async function getServerSideProps({ req }) {

  let membershipStatus, config, request;
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
      title: 'Survey Question | Abracadbara Starquest',
      bottomConfig: {
        myPoints: data?.[2] ?? {},
        allEvents: data?.[0] ?? {},
        membershipStatus: membershipStatus ?? {}
      }
    }
  };
}
