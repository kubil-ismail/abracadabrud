import Username from 'components/element/Username';
import Link from 'next/link';
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import service from 'core/services/publicService';
import LoadingPodium from 'components/skeleton/LoadingPodium';
import ModalShare from 'components/element/modal/ModalShare';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

export default function ListRankVoted({ data, current, last, loading, handleNextPage, eventId }) {
  const { t } = useTranslation();
  const [currentUser, setCurrentUser] = useState(null);
  const [modalShareShow, setModalShareShow] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.authentication);
  const [url, setUrl] = useState('');
  const { basePath } = useRouter();
  const { locale } = useRouter();

  useEffect(() => {
    service
      .get(`${process.env.NEXT_PUBLIC_SITE_URL}/api/contestants/events/${eventId}/my-vote-ranking`)
      .then((res) => {
        setCurrentUser(res?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [eventId]);

  const [videos, setVideos] = useState([]);

  useEffect(() => {
    service
      .get(`${process.env.NEXT_PUBLIC_SITE_URL}/api/me/videos`)
      .then((res) => {
        // get last video
        setVideos(res?.data?.data?.videos[res?.data?.data?.videos.length - 1]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (user && isAuthenticated) {
      setUrl(
        `${window.location.origin}${basePath}/video/${videos?.id}?referral=${user?.my_referal_code}`
      );
    } else {
      setUrl(`${window.location.origin}${basePath}/video/${videos?.id}`);
    }
  }, [user, videos?.id]);

  const shareText = `${user?.username} - ${videos?.caption}
Check out my music video! Make sure to vote for it often so I can win the opportunity to perform at the wePOP come together on 6 August 2023.

It's Easy! Click this link, vote for me now, and you too can win amazing weekly prizes:
THANKS!
`;

  // const handleShare = () => {
  //   if (user && isAuthenticated) {

  //     shareWithNavigator({
  //       title: '',
  //       text: `${performer} - ${caption}
  //       Check out my music video! Make sure to vote for it often so I can win the opportunity to perform at the wePOP come together on 6 August 2023.

  //       It's Easy! Click this link, vote for me now, and you too can win amazing weekly prizes:

  //       THANKS!`,
  //       link: url,
  //     });

  //   } else {
  //     shareWithNavigator({
  //       title: event?.title,
  //       text: `How are you ${performer}`,
  //       link: url,
  //     });
  //   }
  // }
  useEffect(() => {
    if (modalShareShow) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  });

  return (
    <div className="flex flex-col space-y-3">
      {modalShareShow && (
        <ModalShare
          videoId={videos.id}
          dataUser={user}
          text={shareText}
          url={url}
          quote={shareText}
          name={user?.username}
          captions={videos?.caption}
          onHide={() => setModalShareShow(false)}
          isUser={user?.id === videos?.user_id}
        />
      )}
      {currentUser?.current_user_position && (
        <div className="flex justify-between space-x-3 w-full bg-white/60 text-slate-50 p-1 rounded-md">
          <div className="flex-0">
            <h3 className="text-xl font-bold">{currentUser?.current_user_position}</h3>
          </div>
          <div className="flex-1 flex flex-col">
            <Link href={`/user/${currentUser?.details?.username ?? currentUser?.details?.id}`}>
              <Username
                name={
                  currentUser?.details?.contestant?.artist_band_name ?? currentUser?.details?.name
                }
                fontStyle="text-base md:text-lg font-bold"
              />
              {/* <h3 className="text-base md:text-lg font-bold">{item?.user?.contestant?.artist_band_name ?? item?.user?.username}</h3> */}
            </Link>
            {/* <h3 className="text-lg font-bold">{item?.contestant?.artist_band_name}</h3> */}
            {/* <span className="text-sm font-normal"> Hati Yang Kau Sakiti</span> */}
          </div>
          <div className="flex-0">
            <h3 className="text-xl font-bold">
              {new Intl.NumberFormat(locale, {
                notation: currentUser?.details?.total_votes >= 10000 ? 'compact' : 'standard',
                compactDisplay: 'short',
                roundingMode: currentUser?.details?.total_votes >= 10000 ? 'floor' : 'halfExpand',
                trailingZeroDisplay: 'stripIfInteger',
                maximumFractionDigits: 1
              }).format(currentUser?.details?.total_votes)}
            </h3>
          </div>
        </div>
      )}
      {/* scrollable */}
      <div
        className="flex flex-col space-y-3 overflow-y-auto pr-1"
        style={{ maxHeight: 'calc(80vh - 280px)' }}>
        {data?.slice(3, data.length).map((item, i) => (
          <div className="flex justify-between space-x-3 w-full" key={i}>
            <div className="flex-0">
              <h3 className="text-xl font-bold">{4 + i}</h3>
            </div>
            <div className="flex-1 flex flex-col">
              <Link href={`/user/${item?.username ?? item?.id}`}>
                <Username
                  name={item?.contestant?.artist_band_name ?? item?.name}
                  fontStyle="text-base md:text-lg font-bold"
                />
                {/* <h3 className="text-base md:text-lg font-bold">{item?.contestant?.artist_band_name ?? item?.name}</h3> */}
              </Link>
              {/* <h3 className="text-lg font-bold">{item?.contestant?.artist_band_name}</h3> */}
              {/* <span className="text-sm font-normal"> Hati Yang Kau Sakiti</span> */}
            </div>
            <div className="flex-0">
              <h3 className="text-xl font-bold">
                {new Intl.NumberFormat(locale, {
                  notation: item?.votes >= 10000 ? 'compact' : 'standard',
                  compactDisplay: 'short',
                  roundingMode: item?.votes >= 10000 ? 'floor' : 'halfExpand',
                  trailingZeroDisplay: 'stripIfInteger',
                  maximumFractionDigits: 1
                }).format(item?.votes)}
              </h3>
            </div>
          </div>
        ))}
      </div>
      {loading && <LoadingPodium />}
      {current < last && (
        <button
          className="text-slate-50 text-sm m-auto p-3 border border-slate-50 rounded-md focus:outline-none"
          onClick={() => {
            if (current < last) {
              handleNextPage(current + 1);
            }
          }}>
          {loading ? 'Loading...' : `${t('Show More')}`}
        </button>
      )}
      {isAuthenticated && (
        <button
          className="bg-[#0000FF] text-slate-50 text-sm md:text-lg m-auto px-4 py-3 md:py-2 rounded-lg w-full focus:outline-none"
          onClick={() => {
            if (!videos) return toast.error(t('You have not uploaded any video yet'));
            setModalShareShow(true);
          }}>
          {t('Get more votes!')}
        </button>
      )}
    </div>
  );
}
