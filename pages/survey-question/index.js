import SurveyQuestions from 'components/my-account/SurveyQuestions';
import SSServices from 'core/services/ServerSide/ssServices';
import getCredential from 'core/services/helpers/getCredential';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import getLayouts from 'utils/getLayouts';
import parse from 'html-react-parser';

export default function SurveyQuestion(props) {
  const { t } = useTranslation()
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.authentication);
  const [seo] = props?.data ?? [];

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
      <div className="flex flex-col space-y-8 md:space-y-12 min-h-screen">
        <h3 className="text-3xl font-bold text-slate-50">{t('Survey Question')}</h3>
        <SurveyQuestions />
      </div>
    </>
  );
}

SurveyQuestion.getLayout = (page, props) => getLayouts(page, 'base', props);

export async function getServerSideProps({ req }) {
  let membershipStatus, config = [], request, global;
  const { isAuthenticated, token } = getCredential({ req });

  global = [
    SSServices.getSeo({ path: '/survey-question' })
  ];

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
      title: 'Upload Video | Abracadbara Starquest',
      data,
      bottomConfig: {
        myPoints: data?.[3] ?? {},
        allEvents: data?.[1] ?? {},
        membershipStatus: membershipStatus ?? {}
      }
    }
  };
}
