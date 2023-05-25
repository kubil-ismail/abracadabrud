import { Disclosure } from '@headlessui/react';
import moment from 'moment';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import EllipsisText from 'react-ellipsis-text/lib/components/EllipsisText';
import { useTranslation } from 'react-i18next';
import ReactPlayer from 'react-player/youtube';
import { useGetMyVideosQuery } from '../../core/services/rtk/MeServices';
import BottomSheetsVote from '../bottom-sheets/BottomSheetsVote';
import ButtonVote from '../element/ButtonVote';
import ThreeDotVideo from '../element/ThreeDotVideo';
import EmptyVideos from '../empty-placeholder/EmptyVideos';

export default function YourVideos({ favoriteList, voteList }) {
  const timestampRef = useRef(Date.now()).current;
  const { t } = useTranslation();
  const [favoriteVideo, setFavoriteVideo] = useState([]);
  const [voteVideo, setVoteVideo] = useState([]);
  const {
    data: dataMyVideo,
    error,
    isLoading
  } = useGetMyVideosQuery(
    {
      sessionId: timestampRef
    },
    {
      refetchOnMountOrArgChange: true
    }
  );

  useEffect(() => {
    setVoteVideo(voteList);
    setFavoriteVideo(favoriteList);
  }, [voteList, favoriteList]);

  console.log('dataMyVideo', dataMyVideo);
  
  return (
        <Disclosure>
    {({ open }) => (
      <div>
        <Disclosure.Button
          className="flex w-full justify-between text-left text-sm font-medium focus:outline-none bg-zinc-800 p-3 rounded-md"
        >
          <span className="text-lg text-slate-50 cursor-pointer hover:text-[#FF00CA] transition-all delay-100 ease-in-out font-bold">
            {t('Your videos')}
          </span>
          <Image
          src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/chevron-down.png`}
          alt="chevron"
          width={26}
          height={26}
          className={`${open ? 'rotate-180 transform' : ''}`}
          />
          {/* <IoIosArrowDown
            className={`${open ? 'rotate-180 transform' : ''} h-5 w-5`}
          /> */}
        </Disclosure.Button>
        <Disclosure.Panel className="text-xs sm:text-sm py-8 md:py-10">
        <div className="flex flex-col space-y-7">
      {/* <h3 className="font-bold text-[#23FF2C] text-xl m-0">{t('Your Videos:')}</h3> */}
      {dataMyVideo?.data?.videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {dataMyVideo?.data?.videos.map((data) => (
            <div className="grid grid-cols-2 space-x-4">
              <div className="h-28 w-full flex-1">
                <ReactPlayer
                  url={data?.video}
                  width="100%"
                  height="100%"
                  light={true}
                  controls
                  playing
                  className="w-full h-full rounded-[20px] overflow-hidden"
                />
              </div>
              <div>
                <div className="flex justify-between space-x-4">
                  <div className="">
                    <div className="flex space-x-1 items-center">
                      <span className="text-[10px] font-light">
                        <EllipsisText
                          text={data?.user?.contestant?.artist_band_name ?? 'Unknown'}
                          length={15}
                        />
                      </span>
                      <span>&middot;</span>
                      <span className="text-[10px]  font-light">
                        {moment(data?.created_at).fromNow()}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm">
                      <EllipsisText text={data?.caption ?? ''} length={20} />
                    </h3>
                  </div>
                  <ThreeDotVideo
                    className="flex-0"
                    idVideo={data?.thumbnails?.[0]?.video_id}
                    caption={data?.caption}
                    performer={data?.user?.contestant?.artist_band_name}
                    handleFavorite={() => {
                      setFavoriteVideo([...favoriteVideo, ...[data?.thumbnails?.[0]?.video_id]]);
                    }}
                    disableFavorite={favoriteVideo?.find(
                      (_item) => _item === data?.thumbnails?.[0]?.video_id
                    )}
                    userID={data?.user_id}
                  />
                </div>
                <div className="mt-3 flex justify-between space-x-4 items-center">
                  <BottomSheetsVote
                    total={data?.votes ?? 0}
                    idVideo={data?.thumbnails?.[0]?.video_id}
                    idArray={data?.thumbnails?.[0]?.video_id}
                    stillLoading={isLoading}
                    isActive={Boolean(
                      voteVideo?.find((_item) => _item === data?.thumbnails?.[0]?.video_id)
                    )}
                  />
                  <ButtonVote
                    idVideo={data?.thumbnails?.[0]?.video_id}
                    idArray={data?.thumbnails?.[0]?.video_id}
                    handleVote={(val) => { }}
                    small
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyVideos />
      )}
    </div>
        </Disclosure.Panel>
      </div>
    )}
  </Disclosure>
  );
}
