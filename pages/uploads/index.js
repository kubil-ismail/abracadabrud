import FormUpload from 'components/upload-video/FormUpload';
import Rules from 'components/upload-video/Rules';
import getLayouts from 'utils/getLayouts';
import getCredential from 'core/services/helpers/getCredential';
import SSServices from 'core/services/ServerSide/ssServices';

export default function Uploads() {
  return (
    <div className="flex flex-col gap-12">
      <Rules />
      <FormUpload />
    </div>
  );
}

Uploads.getLayout = (page, props) => getLayouts(page, 'base', props);

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
      title: 'Upload Video | Abracadbara Starquest',
      bottomConfig: {
        myPoints: data?.[2] ?? {},
        allEvents: data?.[0] ?? {},
        membershipStatus: membershipStatus ?? {}
      }
    }
  };
};
