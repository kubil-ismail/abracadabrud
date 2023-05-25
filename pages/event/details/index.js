import { useEffect, useState } from 'react';
import Event from '../index';
import getLayouts from 'utils/getLayouts';
import { useRouter } from 'next/router';
import { useGetEventQuery } from 'core/services/rtk/EventServices';
import Image from 'next/image';
import SSServices from 'core/services/ServerSide/ssServices';
import getCredential from 'core/services/helpers/getCredential';

export default function Details() {
  const router = useRouter();
  const [id, setId] = useState(null);

  useEffect(() => {
    if (router.query.id) {
      setId(router.query.id);
    }
  }, [router.query.id]);

  const { data } = useGetEventQuery(id);

  return (
    <Event>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50">
          <Image src={data?.event?.image} width={300} height={200} />
          <div className="absolute top-0 right-0 p-4">
            <button
              className="text-white"
              onClick={() => router.push('/event', undefined, { shallow: true })}>
              X
            </button>
          </div>
        </div>
      </div>
    </Event>
  );
}

Details.getLayout = (page, props) => getLayouts(page, 'base', props);

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
      title: 'Events Detail | Abracadbara Starquest',
      bottomConfig: {
        myPoints: data?.[2] ?? {},
        allEvents: data?.[0] ?? {},
        membershipStatus: membershipStatus ?? {}
      }
    }
  };
};
