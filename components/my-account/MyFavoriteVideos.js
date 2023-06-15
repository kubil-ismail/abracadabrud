import { Disclosure } from '@headlessui/react';
import moment from 'moment';
import Image from 'next/image';
import React, { useRef } from 'react';
import EllipsisText from 'react-ellipsis-text';
import { useTranslation } from 'react-i18next';
import ReactPlayer from 'react-player/youtube';
import { useGetFavoriteVideoQuery } from 'core/services/rtk/MeServices';
import BottomSheetsVote from '../bottom-sheets/BottomSheetsVote';
import ButtonVote from '../element/ButtonVote';
import ThreeDotVideo from '../element/ThreeDotVideo';
import EmptyFavorite from '../empty-placeholder/EmptyFavorite';

export default function MyFavoriteVideos({ voteList }) {
  const timestampRef = useRef(Date.now()).current;
  const { t } = useTranslation();
  const [data, setData] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [temporary, setTemporary] = React.useState([]);
  const [voteVideo, setVoteVideo] = React.useState([]);

  const { data: dataFavoriteVideo } = useGetFavoriteVideoQuery(
    {
      page: currentPage,
      pageSize: 6,
      sessionId: timestampRef
    },
    {
      refetchOnMountOrArgChange: true
    }
  );

  React.useEffect(() => {
    if (currentPage === 1) setData(dataFavoriteVideo?.data ?? []);
  }, [dataFavoriteVideo]);

  React.useEffect(() => {
    if (currentPage > 1) {
      setData([...data, ...(dataFavoriteVideo?.data ?? [])] ?? []);
      setIsLoading(false);
    }
  }, [dataFavoriteVideo]);

  console.log('voteList', voteList);

  React.useEffect(() => {
    setVoteVideo(voteList);
  }, [voteList]);


  return (
        <Disclosure>
    {({ open }) => (
      <div>
        <Disclosure.Button
          className="flex w-full justify-between text-left text-sm font-medium focus:outline-none bg-zinc-800 p-3 rounded-md"
        >
          <span className="text-lg text-slate-50 cursor-pointer hover:text-[#FF00CA] transition-all delay-100 ease-in-out font-bold">
            {t('Favorited video')}
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
      {/* <h3 className="font-bold text-[#23FF2C] text-xl m-0">{t('My Favorite Videos:')}</h3> */}
      {data?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <>
            {data.map((item) => (
              <div className="grid grid-cols-2 space-x-4">
                <div className="h-28 w-full flex-1">
                  <ReactPlayer
                    url={item?.video?.video}
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
                            text={item?.video?.user?.contestant?.artist_band_name ?? 'Unknown'}
                            length={15}
                          />
                        </span>
                        <span>&middot;</span>
                        <span className="text-[10px]  font-light">
                          {item?.created_at ? moment(item?.created_at, 'YYYY-MM-DD').fromNow() : ''}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm">
                        <EllipsisText text={item?.video?.caption ?? ''} length={22} />
                      </h3>
                    </div>
                    <ThreeDotVideo
                      className="flex-0"
                      idVideo={item?.video_id}
                      performer={item?.video?.user?.contestant?.artist_band_name}
                      caption={item?.video?.caption}
                      userID={item?.video?.user_id}
                      disableFavorite
                    />
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <BottomSheetsVote
                      total={
                        item?.video?.votes +
                        temporary
                          .filter((_item) => _item?.video_id === item?.video_id)
                          .map((_item) => _item?.value)
                          ?.reduce((partialSum, a) => partialSum + a, 0) ?? 0
                      }
                      idVideo={item?.video_id}
                      idArray={item?.video_id}
                      stillLoading={isLoading}
                      isActive={Boolean(voteVideo?.find((_item) => _item === item?.video_id))}
                    />
                    <ButtonVote
                      idVideo={item?.video_id}
                      idArray={item?.video_id}
                      handleVote={(val) => {
                        setVoteVideo([...voteVideo, ...[item?.video_id]]);
                        setTemporary([...temporary, ...[{ video_id: item?.video_id, value: val }]]);
                      }}
                      small
                    />
                  </div>
                </div>
              </div>
            ))}
          </>
        </div>
      ) : (
        <EmptyFavorite />
      )}

      {currentPage < dataFavoriteVideo?.last_page && (
        <div className="flex justify-center">
          <button
            type="button"
            className="px-5 py-2 text-gray-200 border border-zinc-700 font-medium text-base w-40 rounded-md"
            onClick={() => {
              setCurrentPage(1 + currentPage);
              setIsLoading(true);
            }}
            disabled={isLoading}>
            {isLoading ? 'Loading...' : `${t('Load More')}`}
          </button>
        </div>
      )}
    </div>
        </Disclosure.Panel>
      </div>
    )}
  </Disclosure>
  );
}
