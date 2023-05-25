import BackstageGallery from 'components/premium-access/BackstageGallery';
import BadgeInfo from 'components/premium-access/BadgeInfo';
import CardVideoBackstage from 'components/premium-access/CardVideoBackstage';
import SponsorVideo from 'components/sponsor/SponsorVideo';
import { useSelector } from 'react-redux';
import getLayouts from '../../utils/getLayouts';
import { useGetAdsSponsorQuery } from 'core/services/rtk/AdsServices';
import { useGetPremiumContentQuery } from 'core/services/rtk/MembershipServices';
import ArtisBios from 'components/premium-access/ArtistBios';
import InfoPanel from 'components/premium-access/InfoPanel';
import getCredential from 'core/services/helpers/getCredential';
import SSServices from 'core/services/ServerSide/ssServices';

export default function PremiumAccess(props) {
  const { membershipsInfo } = useSelector((state) => state?.memberships);
  const { isAuthenticated } = useSelector((state) => state.authentication);
  const { allEvents } = useSelector((state) => state.global);

  const { data: dataSponsor } = useGetAdsSponsorQuery(
    {},
    {
      refetchOnMountOrArgChange: true
    }
  );

  const { data } = useGetPremiumContentQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
      skip: !isAuthenticated || membershipsInfo?.memberships?.length === 0
    }
  );

  return (
    <div className="flex flex-col gap-12">
      <BadgeInfo isMembership={isAuthenticated && membershipsInfo?.memberships?.length} />
      <div
        style={
          isAuthenticated && membershipsInfo?.memberships?.length > 0
            ? {}
            : { filter: 'brightness(50%) blur(10px)' }
        }
        className={'flex flex-col gap-12'}>
        {data?.data?.map((item, key) =>
          item?.type === 'biography' ? (
            <ArtisBios
              title={item?.data?.title}
              image={item?.data?.image}
              description={item?.data?.description}
            />
          ) : item?.type === 'image' ? (
            <BackstageGallery data={item?.data} />
          ) : item?.type === 'video' ? (
            <CardVideoBackstage data={item} />
          ) : (
            <></>
          )
        )}

        {dataSponsor?.videos
          ?.filter((res) => res.event_id === allEvents?.data?.data[0]?.id)
          ?.slice(0, 1)
          .map((data) => (
            <div className="w-full md:max-w-3xl md:m-auto">
              <SponsorVideo
                video={data?.video_url}
                title={data?.name}
                id={data?.id}
                readOnly={false}
                isImage={data?.source_of_the_file === 'file'}
                image={{ desktop: data?.desktop_image, mobile: data?.mobile_image }}
                heightParent={{ mobile: '500px', desktop: '500px' }}
                height="400px"
              />
            </div>
          ))}
        <div className="w-full md:max-w-3xl md:m-auto">
          <InfoPanel />
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = async ({ req }) => {
  let membershipStatus,
    config = [],
    request;
  let props = {
    authenticated: false
  };

  const { isAuthenticated, token } = getCredential({ req });

  if (isAuthenticated && token) {
    config = [
      SSServices.getAllEvents(),
      SSServices.getMemberships({ token }),
      SSServices.getMyPoints({ token })
    ]; // mandatory for root used

    props = { ...props, authenticated: true };
  }

  request = []; // mandatory for this page

  const data = await Promise.all([...config, ...request]);

  if (
    ((data[0]?.data &&
      data?.[0]?.data?.data?.[0]?.current_contest &&
      data?.[0]?.data?.data?.[0]?.memberships) ??
      (data?.[0]?.last_event?.event_contest_id &&
        data?.[0]?.last_event?.membership?.id)) &&
    token
  ) {
    props = { ...props, memberships: JSON.parse(JSON.stringify(data[1])) || [] };
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
      title: 'Premium Access | Abracadbara Starquest',
      bottomConfig: {
        myPoints: data?.[2] ?? {},
        allEvents: data?.[0] ?? {},
        membershipStatus: membershipStatus ?? {}
      }
    }
  };
};

PremiumAccess.getLayout = (page, props) => getLayouts(page, 'base', props);
