import CardVideo from 'components/element/CardVideo';
import Username from 'components/element/Username';
import EmptyPlaceholder from 'components/empty-placeholder/EmptyPlaceholder';
import EmptyVideoUser from 'components/empty-placeholder/EmptyVideoUser';
import SponsorVideo from 'components/sponsor/SponsorVideo';
import AboutUser from 'components/user/AboutUser';
import EngagementInfo from 'components/user/EngagementInfo';
import SocialLinks from 'components/user/SocialLinks';
import SSServices from 'core/services/ServerSide/ssServices';
import getCredential from 'core/services/helpers/getCredential';
import { useGetAdsSponsorQuery } from 'core/services/rtk/AdsServices';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import BannerUser from '../../components/user/BannerUser';
import getLayouts from '../../utils/getLayouts';
import { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';
import service from 'core/services/publicService';
import EllipsisText from 'react-ellipsis-text';
import { setMultipleSponsorPlayed, clearSponsorPlayed } from 'core/redux/reducers/globalSlice';

export default function User({ dataMe, dataUser, userId }) {
  const { t } = useTranslation();
  const { token } = useSelector((state) => state.authentication);
  const { allEvents, sponsorPlaying } = useSelector((state) => state.global);
  const dispatch = useDispatch();
  const [played, setPlayed] = useState([]);
  const [likeList, setLikeList] = useState([]);

  const { data: dataSponsor } = useGetAdsSponsorQuery(
    {},
    {
      refetchOnMountOrArgChange: true
    }
  );

  const ads = dataSponsor?.videos
    ?.filter(
      (res) => res.event_id === allEvents?.data?.data[0]?.id && res?.source_of_the_file !== 'file'
    )
    .sort(() => Math.random() - 0.5);

  useEffect(() => {
    if (token && getCookie('_token')) {
      service
        .get(`${process.env.NEXT_PUBLIC_SITE_URL}/api/is-voted-and-favorited-videos`)
        .then(function (result) {
          const { already_watched_ads: _ads, favorites: _fav } = result?.data || {};


          setLikeList(_fav ?? []);

          if (_ads?.length) {
            setPlayed(_ads);
            dispatch(setMultipleSponsorPlayed(_ads));
          } else {
            dispatch(clearSponsorPlayed());
            setPlayed([]);
          }
        });
    }
  }, [token]);

  console.log('datame', dataMe)

  return (
    <div className="pb-16">
      <BannerUser data={dataUser?.data} />
      {/* <ProfileUser data={dataUser?.data} /> */}
      <div className=" -mt-16 md:-mt-44">
        <div className="flex flex-col w-full items-center gap-5">
          {/* <PhotoProfile image={data?.user?.photo ?? '/assets/images/user.png'} styles="h-32 w-32 md:w-64 md:h-64 border-4 border-white" /> */}
          <img
            src={dataUser?.data?.user?.photo ?? '/assets/images/user.png'}
            alt="photo"
            className="h-32 w-32 md:w-64 md:h-64 rounded-full object-cover border-4 border-white"
            onError={(e) => (e.target.src = '/assets/images/user.png')}
          />
          <Username
            name={
              <EllipsisText
                text={
                  dataUser?.data?.user_contestants[0]?.artist_band_name
                    ? dataUser?.data?.user_contestants[0]?.artist_band_name
                    : dataUser?.data?.user?.name
                    ?? 'Unknown'
                }
                length={40}
              />
              // dataUser?.data?.user_contestants[0]?.artist_band_name
              //   ? dataUser?.data?.user_contestants[0]?.artist_band_name
              //   : dataUser?.data?.user?.name
            }
            fontStyle="text-2xl font-bold text-center"
          />
        </div>
        {/* <h3 className="text-2xl font-bold">{ data?.user_contestants[0]?.artist_band_name ?  data?.user_contestants[0]?.artist_band_name : data?.user?.name}</h3> */}
      </div>
      <div className="flex flex-col space-y-12 mt-5">
        <EngagementInfo
          favorite={dataUser?.data?.total_favorites}
          votes={dataUser?.data?.total_votes}
        />
        <AboutUser
          about={dataUser?.data?.user_contestants[0]?.description ?? dataUser?.data?.user?.about}
        />
        {(dataMe?.data?.user_social_media?.instagram ||
          dataMe?.data?.user_social_media?.tiktok ||
          dataMe?.data?.user_social_media?.twitter ||
          dataMe?.data?.user_social_media?.facebook) && (
            <SocialLinks
              name={
                dataUser &&
                (dataUser?.data?.user_contestants[0]?.artist_band_name ?? dataUser?.data?.user?.name)
              }
              data={dataMe?.data?.user_social_media}
            />
          )}
        {/* <ReactionVideo /> */}
        <div className="flex flex-col space-y-6">
          <h3 className="text-xl md:text-2xl font-bold">{`${dataUser &&
            (dataUser?.data?.user_contestants[0]?.artist_band_name ?? dataUser?.data?.user?.name)
            }'s Video`}</h3>
          {dataUser?.data?.user_videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 md:gap-5 ">
              <>
                {dataUser?.data?.user_videos?.map(
                  (datas) =>
                    datas?.video_url !== null && (
                      <CardVideo
                        bandName={
                          dataUser?.data?.user_contestants[0]?.artist_band_name ??
                          dataUser?.data?.user?.name
                        }
                        username={dataUser?.data?.user?.username}
                        userId={datas?.user_id}
                        photo={dataUser?.data?.user?.photo}
                        dataVideo={dataUser?.data?.user_videos}
                        videoUrl={datas?.video_url}
                        videoId={datas?.video_id}
                        caption={datas?.caption}
                        totalFavorite={datas?.total_favorite}
                        totalComment={datas?.total_comment}
                        totalVote={datas?.total_voted}
                        date={datas?.created_at}
                        ids={dataUser?.data?.user_videos?.map((items) => items?.video_id)}
                        current={datas}
                        isActiveFavorite={likeList?.find((_item) => _item === datas?.video_id)}
                        handleFavorite={() => {
                          setLikeList([...likeList, ...[datas?.video_id]]);
                        }}
                      />
                    )
                )}
              </>
            </div>
          ) : (
            <div className="py-7 flex items-center justify-center w-full">
              <EmptyVideoUser />
            </div>
          )}
        </div>
        {/* <VideoUser data={dataUser?.data} name={dataUser?.data?.user?.name} /> */}
        <div className="flex flex-col space-y-5">
          <h3 className="text-xl md:text-2xl font-bold">{t('Sponsor Video')}</h3>
          <div className="aspect-video h-full md:m-auto">
            {ads?.length > 0 ? (
              <SponsorVideo
                video={ads[0]?.video_url}
                title={ads[0]?.name}
                id={ads[0]?.id}
                isImage={ads[0]?.source_of_the_file === 'file'}
                image={{
                  desktop: ads[0]?.desktop_image,
                  mobile: ads[0]?.mobile_image
                }}
                alreadyWatched={played?.find((res) => res === ads[0]?.id)}
              />
            ) : (
              <EmptyPlaceholder
                image={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/empty-videos.png`}
                text="Oops, there are no sponsor video at this time."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// getServersideProps
export async function getServerSideProps(context) {
  const { query, req, res } = context;
  const { userId } = query;

  let membershipStatus,
    config = [],
    request,
    global;
  const { isAuthenticated, token } = getCredential({ req });

  global = [SSServices.getProfiles({ userId }), SSServices.getUserSocialMedia({ userId })];

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

  // redirect if user not found
  if (!data?.[0]?.data?.user?.id) {
    res.writeHead(302, { Location: '/404' });
    res.end();
  }

  return {
    props: {
      dataMe: data?.[1] ?? {},
      dataUser: data?.[0] ?? {},
      userId,
      title:
        (data?.[0]?.data?.user_contestants[0]?.artist_band_name ??
          data?.[0]?.data?.user?.name ??
          `Profile`) + ' | Abracadabra Starquest',
      bottomConfig: {
        myPoints: data?.[4] ?? {},
        allEvents: data?.[2] ?? {},
        membershipStatus: membershipStatus ?? {}
      }
    }
  };
}

User.getLayout = (page, props) => getLayouts(page, 'base', props);
