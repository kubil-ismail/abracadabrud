import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import ReactPlayer from 'react-player';
import BottomSheetsFavorite from '../bottom-sheets/BottomSheetsFavorite';
import BottomSheetsVote from '../bottom-sheets/BottomSheetsVote';
import EmptyVoteModal from '../empty-placeholder/EmptyVoteModal';
import ThreeDotVideo from './ThreeDotVideo';
import EllipsisText from 'react-ellipsis-text';
// import SponsorVideo from './SponsorVideo';
import ButtonVote from './ButtonVote';
import SponsorVideo from 'components/sponsor/SponsorVideo';
import InfiniteScroll from 'react-infinite-scroll-component';
import service from 'core/services/publicService';
import { useDispatch, useSelector } from 'react-redux';
import PhotoProfile from './PhotoProfile';
import Username from './Username';
import ModalReportVideo from './modal/ModalReportVideo';
import { setFilterContent, setFilterLoading } from 'core/redux/reducers/modalSlice';
import ModalFilterVideo from './modal/ModalFilterVideo';
import ButtonShare from './ButtonShare';
import { setMultipleSponsorPlayed, clearSponsorPlayed } from 'core/redux/reducers/globalSlice';
import { getCookie } from 'cookies-next';

export default function CardVideo() {
  const dispatch = useDispatch();
  const [total, setTotal] = useState(1);
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [likeList, setLikeList] = useState([]);
  const [votedList, setVotedList] = useState([]);
  const [watchedList, setWatchedList] = useState([]);
  const [datas, setDatas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingBottom, setIsLoadingBottom] = useState(false);
  const [isPlay, setIsPlay] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const {
    authentication: { token },
    modal: { filterContent }
  } = useSelector((state) => state);
  const [fresh, setFresh] = useState(false);

  const handleNextPage = (next) => {
    service
      .get(`${process.env.NEXT_PUBLIC_SITE_URL}/api/caching-data-video-ads?page=${next}`)
      .then((result) => {
        setDatas([...datas, ...(result?.data?.data ?? [])]);
        setTotal(result?.data?.last_page);
        setPage(next);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const youtube_parser = (url) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length == 11 ? match[7] : false;
  };

  useEffect(() => {
    if (token && getCookie('_token')) {
      setIsLoadingBottom(true);

      service
        .get(`${process.env.NEXT_PUBLIC_SITE_URL}/api/is-voted-and-favorited-videos`)
        .then(function (result) {
          const { favorites: _fav, votes: _vote, already_watched_ads: _ads } = result?.data || {};

          setLikeList(_fav ?? []);
          setVotedList(_vote ?? []);
          setWatchedList(_ads ?? []);

          if (_ads?.length) {
            dispatch(setMultipleSponsorPlayed(_ads));
          } else {
            dispatch(clearSponsorPlayed());
          }
        })
        .finally(() => {
          setIsLoadingBottom(false);
        });
    }
  }, [token]);

  useEffect(() => {
    const ios = () => {
      if (typeof window === `undefined` || typeof navigator === `undefined`) return false;

      return /iPhone|iPad|iPod/i.test(
        navigator.userAgent ||
          navigator.vendor ||
          (window.opera && opera.toString() === `[object Opera]`)
      );
    };

    if (ios()) {
      setIsMuted(true);
    }

    service.get(`${process.env.NEXT_PUBLIC_SITE_URL}/api/shuffle-data-video-ads`).finally(() => {
      dispatch(setFilterContent('default'));
      setFresh(true);
    });
  }, []);

  useEffect(() => {
    if (fresh) {
      service
        .get(`${process.env.NEXT_PUBLIC_SITE_URL}/api/caching-data-video-ads?page=${page}`)
        .then((result) => {
          setDatas(result?.data?.data ?? []);
          setTotal(result?.data?.last_page);
        })
        .finally(() => {
          setIsLoading(false);
          setFresh(false);
        });
    }
  }, [fresh]);

  useEffect(() => {
    if (filterContent && filterContent !== 'other' && filterContent !== 'events') {
      setPage(1);
      dispatch(
        setFilterLoading({
          loading: true,
          type: filterContent?.type ?? filterContent
        })
      );
      if (filterContent?.type === 'search') {
        service
          .get(
            `${process.env.NEXT_PUBLIC_SITE_URL}/api/shuffle-data-video-ads?sort=other&search=${filterContent?.value}`
          )
          .finally(() => {
            setFresh(true);
            dispatch(
              setFilterLoading({
                loading: false,
                type: filterContent?.type ?? filterContent
              })
            );
          });
      } else if (filterContent?.type === 'events') {
        service
          .get(
            `${process.env.NEXT_PUBLIC_SITE_URL}/api/shuffle-data-video-ads?sort=event&event_id=${filterContent?.value}`
          )
          .finally(() => {
            setFresh(true);
            dispatch(
              setFilterLoading({
                loading: false,
                type: filterContent?.type ?? filterContent
              })
            );
          });
      } else if (filterContent?.type === 'default') {
        service
          .get(`${process.env.NEXT_PUBLIC_SITE_URL}/api/shuffle-data-video-ads`)
          .finally(() => {
            setFresh(true);
            dispatch(
              setFilterLoading({
                loading: false,
                type: filterContent?.type ?? filterContent
              })
            );
          });
      } else if (filterContent?.type === 'date' && filterContent?.value) {
        service
          .get(
            `${process.env.NEXT_PUBLIC_SITE_URL}/api/shuffle-data-video-ads?sort=date&start_date=${filterContent?.value?.start}&end_date=${filterContent?.value?.end}`
          )
          .finally(() => {
            setFresh(true);
            dispatch(
              setFilterLoading({
                loading: false,
                type: filterContent?.type ?? filterContent
              })
            );
          });
      } else {
        service
          .get(
            `${process.env.NEXT_PUBLIC_SITE_URL}/api/shuffle-data-video-ads?sort=${filterContent}`
          )
          .finally(() => {
            setFresh(true);
            dispatch(
              setFilterLoading({
                loading: false,
                type: filterContent?.type ?? filterContent
              })
            );
          });
      }
    }
  }, [filterContent]);

  const [isMobileDevice, setIsMobileDevice] = useState(false);
  // on resize
  const handleResize = () => {
    if (window.innerWidth < 768) {
      setIsMobileDevice(true);
    } else {
      setIsMobileDevice(false);
    }
  };
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isLoading || !Boolean(datas?.length)) {
    return (
      <div className="max-w-5xl md:mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-5 text-slate-50">
          <div className="w-full h-[191px] md:h-[400px] rounded-[23px]">
            <div
              role="status"
              className="flex items-center md:w-[500px] md:h-[250px] justify-center max-w-sm bg-gray-300 animate-pulse dark:bg-gray-700 rounded-lg">
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

            <div className="flex items-center mt-4 space-x-3">
              <svg
                className="text-gray-200 w-14 h-14 dark:text-gray-700"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  llRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                  clip-rule="evenodd"></path>
              </svg>
              <div>
                <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
                <div className="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="max-w-5xl md:mx-auto">
        <ModalReportVideo />
        <ModalFilterVideo />
        <div className="grid grid-cols-1 md:grid-cols-1 space-y-5 text-slate-50">
          {isOpen && <EmptyVoteModal onClose={() => setIsOpen(false)} />}

          <InfiniteScroll
            dataLength={datas?.length} //This is important field to render the next data
            next={() => {
              const next = page + 1;
              if (next > total) {
                handleNextPage(1);
              } else {
                handleNextPage(next);
              }
            }}
            endMessage={
              isLoading && (
                <div className="px-3 py-3 mt-5 text-xs font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">
                  loading...
                </div>
              )
            }
            hasMore={total > 1}
            loader={
              <div className="px-3 py-3 mt-5 text-xs font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">
                loading...
              </div>
            }>
            {datas?.length === 0 || (datas?.length === 1 && datas[0]?.ads_id) ? (
              <>
                <img
                  src="/assets/images/warnings.png"
                  alt="warning"
                  className="w-40 m-auto mb-2"
                  loading="lazy"
                />
                <h3 className="text-lg font-semibold text-center">
                  The video you are looking for is not available.
                </h3>
              </>
            ) : (
              datas?.map((item, index) => (
                <>
                  {item?.ads_id ? (
                    <>
                      {item?.ads?.source_of_the_file === 'file' ? (
                        <div
                          className="mb-[50px] cursor-pointer"
                          onClick={() => window.open(item?.ads?.target_url, '_blank')}>
                          <img
                            className="rounded-[23px]"
                            style={{
                              width: isMobileDevice ? '100%' : '580px',
                              objectFit: 'cover',
                              objectPosition: 'center'
                            }}
                            src={
                              isMobileDevice ? item?.ads?.mobile_image : item?.ads?.desktop_image
                            }
                          />
                        </div>
                      ) : (
                        <div className="mb-[50px] w-full md:h-[320px] md:aspect-video rounded-[23px]">
                          <SponsorVideo
                            video={item?.ads?.video_url}
                            title={item?.ads?.name}
                            key={item?.ads_id}
                            id={item?.ads_id}
                            alreadyWatched={watchedList?.includes(item?.ads_id)}
                            mode="feed"
                            playing={isPlay === item?.ads_id}
                            onClickPreview={() => setIsPlay(item?.ads_id)}
                            onPlay={() => setIsPlay(item?.ads_id)}
                            // muted={isMuted}
                            muted={false}
                            // height="220px"
                            isImage={item?.ads?.source_of_the_file === 'file'}
                            image={{
                              desktop: item?.ads?.desktop_image,
                              mobile: item?.ads?.mobile_image
                            }}
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <div
                      className="flex flex-col space-y-5 mb-[32px] md:mb-[50px]"
                      key={`item_${item?.video_id}`}>
                      <div className="aspect-video w-full h-full md:h-[320px] rounded-[23px] overflow-hidden">
                        <div className="w-full h-full ">
                          {item?.video?.video_url ? (
                            <ReactPlayer
                              url={item?.video?.video_url}
                              width="100%"
                              height="100%"
                              controls
                              className="w-full h-full"
                              playing={isPlay === item?.video_id}
                              playsInline={isPlay === item?.video_id}
                              light={`https://img.youtube.com/vi/${youtube_parser(
                                item?.video?.video_url
                              )}/0.jpg`}
                              onClickPreview={() => {
                                setIsPlay(item?.video_id);
                              }}
                              onPlay={() => {
                                setIsPlay(item?.video_id);
                              }}
                              fileConfig={{ attributes: { autoPlay: isPlay === item?.video_id } }}
                              muted={isMuted}
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
                      <div className="flex flex-col space-y-2 mt-1">
                        <div className="flex justify-between w-full text-slate-50">
                          <div className="flex space-x-[10px]">
                            <div className="flex-0 flex-shrink-0">
                              <Link
                                href={`/user/${
                                  item?.video?.uploader?.username ?? item?.video?.uploader?.user_id
                                }`}>
                                <PhotoProfile
                                  image={item?.video?.uploader?.photo ?? '/assets/images/user.png'}
                                  styles={'w-[52px] h-[52px] rounded-full cursor-pointer'}
                                  verfiedPosition="absolute bottom-2 right-2"
                                  verifiedSize="w-4"
                                />
                              </Link>
                            </div>
                            <div className="flex-1 flex flex-col space-y-1">
                              <div className="flex space-x-2 items-center text-xs font-normal">
                                <Username
                                  name={
                                    <EllipsisText
                                      text={
                                        item?.video?.uploader?.artist_band_name ??
                                        item?.video?.uploader?.name ??
                                        'Unknown'
                                      }
                                      length={18}
                                    />
                                  }
                                  fontStyle="text-xs font-normal mb-0"
                                />
                                <span>&middot;</span>
                                <span className="">
                                  {moment(item?.video?.created_at).fromNow()}
                                </span>
                              </div>
                              <EllipsisText
                                text={item?.video?.caption ?? 'Unknown'}
                                length={28}
                                className="text-base md:text-[18px] font-extrabold m-0"
                              />
                            </div>
                          </div>
                          <div className="flex-0">
                            <ThreeDotVideo
                              idVideo={item?.video_id}
                              idArray={item?.video_id}
                              titleVideo={item?.video?.caption}
                              username={item?.user?.uploader?.username}
                              stillLoading={isLoading}
                              caption={item?.video?.caption}
                              performer={
                                item?.video?.uploader?.artist_band_name ??
                                item?.video?.uploader?.name
                              }
                              isActiveFavorite={likeList?.find((_item) => _item === item?.video_id)}
                              handleFavorite={() => {
                                setLikeList([...likeList, ...[item?.video_id]]);
                                if (!likeList?.find((_item) => _item === item?.video_id)) {
                                  setDatas(
                                    datas?.map((_item) =>
                                      _item?.video_id === item?.video_id
                                        ? {
                                            ..._item,
                                            ...{
                                              video: {
                                                ..._item?.video,
                                                total_favorite: _item?.video?.total_favorite + 1
                                              }
                                            }
                                          }
                                        : _item
                                    )
                                  );
                                }
                              }}
                              userID={item?.video?.user_id}
                            />
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <div className="w-[64px] invisible" />
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
                                    artistName={
                                      item?.video?.uploader?.artist_band_name ??
                                      item?.video?.uploader?.name ??
                                      'Unknown'
                                    }
                                    idVideo={item?.video_id}
                                    caption={item?.video?.caption}
                                    userID={item?.video?.user_id}
                                    className="flex-1"
                                  />
                                </div>
                                <div className="flex-shrink-0">
                                  <BottomSheetsFavorite
                                    total={item?.video?.total_favorite}
                                    idVideo={item?.video_id}
                                    idArray={item?.video_id}
                                    stillLoading={isLoading}
                                    isActive={likeList?.find((_item) => _item === item?.video_id)}
                                    handleFavorite={() => {
                                      setLikeList([...likeList, ...[item?.video_id]]);
                                      if (!likeList?.find((_item) => _item === item?.video_id)) {
                                        setDatas(
                                          datas?.map((_item) =>
                                            _item?.video_id === item?.video_id
                                              ? {
                                                  ..._item,
                                                  ...{
                                                    video: {
                                                      ..._item?.video,
                                                      total_favorite:
                                                        _item?.video?.total_favorite + 1
                                                    }
                                                  }
                                                }
                                              : _item
                                          )
                                        );
                                      }
                                    }}
                                  />
                                </div>
                                {/* <BottomSheetsComment
                                total={item?.video?.total_comments ?? 0}
                                idVideo={item?.video_id}
                                idArray={item?.video_id}
                                stillLoading={isLoading}
                              /> */}
                                <div className="flex-shrink-0">
                                  <BottomSheetsVote
                                    total={item?.video?.total_voted ?? 0}
                                    idVideo={item?.video_id}
                                    idArray={item?.video_id}
                                    stillLoading={isLoading}
                                    isActive={votedList?.find((_item) => _item === item?.video_id)}
                                    data={item}
                                  />
                                </div>
                              </div>
                              <div className="flex-1 flex justify-end w-full">
                                <ButtonVote
                                  idVideo={item?.video_id}
                                  idArray={item?.video_id}
                                  handleVote={(val) => {
                                    setVotedList([...votedList, ...[item?.video_id]]);
                                    setDatas(
                                      datas?.map((_item) =>
                                        _item?.video_id === item?.video_id
                                          ? {
                                              ..._item,
                                              ...{
                                                video: {
                                                  ..._item?.video,
                                                  total_voted: _item?.video?.total_voted + val
                                                }
                                              }
                                            }
                                          : _item
                                      )
                                    );
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ))
            )}
          </InfiniteScroll>
        </div>
      </div>
    );
  }
}
