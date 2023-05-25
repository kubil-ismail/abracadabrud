import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import ReactPlayer from 'react-player';
import BottomSheetsFavorite from '../bottom-sheets/BottomSheetsFavorite';
import BottomSheetsVote from '../bottom-sheets/BottomSheetsVote';
import ThreeDotVideo from './ThreeDotVideo';
import EllipsisText from 'react-ellipsis-text';
// import SponsorVideo from './SponsorVideo';
import ButtonVote from './ButtonVote';
import service from 'core/services/publicService';
import { useDispatch, useSelector } from 'react-redux';
import PhotoProfile from './PhotoProfile';
import Username from './Username';
import ModalReportVideo from './modal/ModalReportVideo';
import ModalShare from './modal/ModalShare';
import { useRouter } from 'next/router';
import ButtonShare from './ButtonShare';
import { setMultipleSponsorPlayed, clearSponsorPlayed } from 'core/redux/reducers/globalSlice';
import { getCookie } from 'cookies-next';

export default function CardVideo({
  username,
  photo,
  videoId,
  videoUrl,
  userId,
  bandName,
  name,
  caption,
  date,
  height,
  totalFavorite,
  totalComment,
  totalVote,
  current,
  isDetail
}) {
  // const dispatch = useDispatch();
  // const [total, setTotal] = useState(1);
  // const [page, setPage] = useState(1);
  // const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const { basePath } = useRouter();
  const [likeList, setLikeList] = useState([]);
  const [votedList, setVotedList] = useState([]);
  const [url, setUrl] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [isLoadingBottom, setIsLoadingBottom] = useState(false);
  const [vote, setVote] = useState(totalVote);
  const [favorite, setFavorite] = useState(totalFavorite);
  const { token } = useSelector((state) => state?.authentication);
  const { isAuthenticated, user } = useSelector((state) => state.authentication);

  useEffect(() => {
    if (user && isAuthenticated) {
      setUrl(
        `${window.location.origin}${basePath}/video/${videoId}?referral=${user?.my_referal_code}`
      );
    } else {
      setUrl(`${window.location.origin}${basePath}/video/${videoId}`);
    }
  }, [user, videoId]);

  const shareText = `${bandName} - ${caption}
Check out my music video! Make sure to vote for it often so I can win the opportunity to perform at the wePOP come together on 6 August 2023.

It's Easy! Click this link, vote for me now, and you too can win amazing weekly prizes:
THANKS!
`;

  const youtube_parser = (url) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length == 11 ? match[7] : false;
  };

  useEffect(() => {
    if (token && getCookie('token')) {
      setIsLoadingBottom(true);

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

          setLikeList(_fav ?? []);
          setVotedList(_vote ?? []);
        })
        .finally(() => {
          setIsLoadingBottom(false);
        });
    }
  }, [token]);

  useEffect(() => {
    setVote(totalVote);
  }, [totalVote]);

  useEffect(() => {
    setFavorite(totalFavorite);
  }, [totalFavorite]);

  return (
    <div
      className="flex flex-col mb-[16px] md:mb-[48px] w-full"
      // key={`item_${item?.video_id}_${item?.video?.total_favorite}_${item?.video?.total_voted}`}
    >
      {showShareModal && (
        <ModalShare
          text={shareText}
          url={url}
          quote={shareText}
          onHide={() => setShowShareModal(false)}
        />
      )}
      <ModalReportVideo />
      <div
        className={`w-full aspect-video md:w-full h-full md:h-[${
          isDetail ? '500px' : '198px'
        }] rounded-t-[23px] overflow-hidden`}>
        <div className="w-full h-full">
          {videoUrl ? (
            <ReactPlayer
              url={videoUrl}
              width="100%"
              height="100%"
              controls
              className="w-full h-full"
              playing={true}
              light={`https://img.youtube.com/vi/${youtube_parser(videoUrl)}/0.jpg`}
            />
          ) : (
            <div
              role="status"
              className="flex items-center justify-center w-full h-full bg-gray-300 rounded-lg animate-pulse dark:bg-gray-700">
              <svg
                className="w-12 h-12 text-gray-200 dark:text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 384 512">
                <path d="M361 215C375.3 223.8 384 239.3 384 256C384 272.7 375.3 288.2 361 296.1L73.03 472.1C58.21 482 39.66 482.4 24.52 473.9C9.377 465.4 0 449.4 0 432V80C0 62.64 9.377 46.63 24.52 38.13C39.66 29.64 58.21 29.99 73.03 39.04L361 215z" />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col space-y-2 p-4 bg-[#323232] rounded-b-[23px]">
        <div className="flex justify-between w-full text-slate-50">
          <div className="flex space-x-[10px]">
            <div className="flex-0">
              <Link href={`/user/${username ?? userId}`}>
                <PhotoProfile
                  image={photo ?? '/assets/images/user.png'}
                  styles={'w-[52px] h-[52px] rounded-full cursor-pointer'}
                  verfiedPosition="absolute bottom-2 right-2"
                  verifiedSize="w-4"
                />
              </Link>
            </div>
            <div className="flex-1 flex flex-col space-y-2">
              <div className="flex space-x-1 items-center text-xs font-normal">
                <Username name={bandName} fontStyle="text-xs font-normal mb-0" />
                <span>&middot;</span>
                <span className="">{moment(date).fromNow()}</span>
              </div>
              <EllipsisText
                text={caption ?? 'Unknown'}
                length={28}
                className="text-[18px] font-extrabold m-0"
              />
            </div>
          </div>
          <div className="flex-0">
            <ThreeDotVideo
              idVideo={current?.id}
              idArray={current?.id}
              titleVideo={caption}
              username={username}
              userID={userId}
              // stillLoading={isLoading}
              caption={caption}
              performer={bandName ?? username}
              isActiveFavorite={likeList?.find((_item) => _item === current?.id)}
              handleFavorite={() => {
                setLikeList([...likeList, ...[current?.id]]);
                setFavorite(favorite + 1);
              }}
            />
          </div>
        </div>
        <div className="flex justify-between">
          {/* <div className={`w-[${isDetail ? '64px' : '10px'}] invisible`} /> */}
          <div className="w-[36px] md:w-[64px] invisible" />
          {isLoadingBottom ? (
            <div className="flex justify-between w-full ">
              <div className="flex items-center w-full space-x-2 ">
                <div className="h-8 bg-zinc-800 rounded-full dark:bg-gray-700 w-20"></div>
                <div className="h-8 bg-zinc-800 rounded-full dark:bg-gray-700 w-20"></div>
                <div className="h-8 bg-zinc-800 rounded-full dark:bg-gray-700 w-20"></div>
              </div>
              <div className="h-8 bg-zinc-800 rounded-full dark:bg-gray-700 w-28"></div>
            </div>
          ) : (
            <div className="flex space-x-3 w-full">
              <div className="flex-1 flex items-center space-x-6 w-full">
                <div className="flex-shrink-0">
                  <ButtonShare
                    artistName={bandName}
                    idVideo={current?.id}
                    caption={caption}
                    userID={userId}
                  />
                </div>
                <div className="flex-shrink-0">
                  <BottomSheetsFavorite
                    total={favorite}
                    idVideo={current?.id}
                    idArray={current?.id}
                    // stillLoading={isLoading}
                    isActive={likeList?.find((_item) => _item === current?.id)}
                  />
                </div>
                {/* <BottomSheetsComment
                  total={totalComment}
                  idVideo={current?.id}
                  idArray={current?.id}
                  // stillLoading={isLoading}
                /> */}
                <div className="flex-shrink-0">
                  <BottomSheetsVote
                    total={vote}
                    idVideo={current?.id}
                    idArray={current?.id}
                    // stillLoading={isLoading}
                    isActive={votedList?.find((_item) => _item === current?.id)}
                    // data={item}
                  />
                </div>
              </div>
              <div className="flex-0">
                <ButtonVote
                  idVideo={current?.id}
                  idArray={current?.id}
                  handleVote={(val) => {
                    setVotedList([...votedList, ...[videoId]]);
                    setVote(vote + val);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
