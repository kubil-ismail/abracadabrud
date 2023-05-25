import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdditionalInformation from 'components/my-account/AdditionalInformation';
import ChangePassword from 'components/my-account/ChangePassword';
import HistoryTransaction from 'components/my-account/HistoryTransaction';
import MyFavoriteVideos from 'components/my-account/MyFavoriteVideos';
import PerformerProfile from 'components/my-account/PerformerProfile';
import Profile from 'components/my-account/Profile';
import ReferralCode from 'components/my-account/ReferralCode';
import SocialMediaAccounts from 'components/my-account/SocialMediaAccounts';
import VideosVotedFor from 'components/my-account/VideosVotedFor';
import YourVideos from 'components/my-account/YourVideos';
import getLayouts from 'utils/getLayouts';
import service from 'core/services/publicService';
import SSServices from 'core/services/ServerSide/ssServices';
import getCredential from 'core/services/helpers/getCredential';
import { setMultipleSponsorPlayed, clearSponsorPlayed } from 'core/redux/reducers/globalSlice';
import { getCookie } from 'cookies-next';

export default function MyAccount(props) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, token } = useSelector((state) => state.authentication);
  const [favoriteList, setFavoriteList] = useState([]);
  const [voteList, setVoteList] = useState([]);

  useEffect(() => {
    if (token && getCookie('token')) {
      service
        .get(`${process.env.NEXT_PUBLIC_SITE_URL}/api/is-voted-and-favorited-videos`)
        .then(function (result) {
          const {
            favorites: _fav,
            votes: _vote,
            already_watched_ads: _ads
          } = result?.data?.data || {};

          if (_ads?.length) {
            dispatch(setMultipleSponsorPlayed(_ads));
          } else {
            dispatch(clearSponsorPlayed());
          }

          setFavoriteList(_fav);
          setVoteList(_vote);
        });
    }
  }, [token]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/');
    }
  }, [router, isAuthenticated]);

  return (
    <div className="flex flex-col space-y-12">
      <Profile me={props?.data?.data} />
      {/* <LinePartition name="User tally" /> */}
      <div className="flex flex-col space-y-6">
        <AdditionalInformation me={props?.data?.data} />
        <ChangePassword />
        <PerformerProfile me={props?.data?.data} />
        <HistoryTransaction />
        <VideosVotedFor favoriteList={favoriteList} voteList={voteList} />
        <YourVideos favoriteList={favoriteList} voteList={voteList} />
        <MyFavoriteVideos voteList={voteList} />
        <ReferralCode />
        <SocialMediaAccounts me={props?.data?.data} />
      </div>
    </div>
  );
}

MyAccount.getLayout = (page, props) => getLayouts(page, 'base', props);

export const getServerSideProps = async ({ req }) => {
  let membershipStatus,
    config = [],
    request;
  const { isAuthenticated, token } = getCredential({ req });

  if (isAuthenticated && token) {
    config = [
      SSServices.getAllEvents(),
      SSServices.getMemberships({ token }),
      SSServices.getMyPoints({ token }),
      SSServices.getMe({ token })
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
      title: 'My Account | Abracadbara Starquest',
      data: data?.[3],
      bottomConfig: {
        myPoints: data?.[2] ?? {},
        allEvents: data?.[0] ?? {},
        membershipStatus: membershipStatus ?? {}
      }
    }
  };
};
