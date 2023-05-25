import { Disclosure } from '@headlessui/react';
import ThreeDotVideo from 'components/element/ThreeDotVideo';
import moment from 'moment';
import Image from 'next/image';
import React, { useRef } from 'react';
import EllipsisText from 'react-ellipsis-text';
import { useTranslation } from 'react-i18next';
import ReactPlayer from 'react-player/youtube';
import { useGetMyVoteQuery } from '../../core/services/rtk/MeServices';
import BottomSheetsVote from '../bottom-sheets/BottomSheetsVote';
import ButtonVote from '../element/ButtonVote';
import EmptyVoted from '../empty-placeholder/EmptyVoted';


export default function VideosVotedFor({ favoriteList }) {
  const timestampRef = useRef(Date.now()).current;
  const { t } = useTranslation();
  const [data, setData] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [favoriteVideo, setFavoriteVideo] = React.useState([]);
  const { data: dataVote } = useGetMyVoteQuery(
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
    if (currentPage === 1) setData(dataVote?.data ?? []);
  }, [dataVote]);

  React.useEffect(() => {
    if (currentPage > 1) {
      setData([...data, ...(dataVote?.data ?? [])] ?? []);
      setIsLoading(false);
    }
  }, [dataVote]);

  React.useEffect(() => {
    setFavoriteVideo(favoriteList);
  }, [favoriteList]);

  return (
        <Disclosure>
    {({ open }) => (
      <div>
        <Disclosure.Button
          className="flex w-full justify-between text-left text-sm font-medium focus:outline-none bg-zinc-800 p-3 rounded-md"
        >
          <span className="text-lg text-slate-50 cursor-pointer hover:text-[#FF00CA] transition-all delay-100 ease-in-out font-bold">
            {t('Video you voted for')}
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
      {/* <h3 className="font-bold text-[#23FF2C] text-xl">{t('Videos you voted for:')}</h3> */}
      {data?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {data?.map((item) => (
            <div className="grid grid-cols-2 gap-4" key={item?.id}>
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
                  <div className="flex flex-col">
                    <div className="flex space-x-1 items-center">
                      <span className="text-xs font-light">
                        <EllipsisText text={item?.video?.user?.contestant?.artist_band_name ?? 'Unknown'} length={10} />
                      </span>
                      <span>&middot;</span>
                      <span className="text-xs font-light">
                        {item?.created_at ? moment(item?.created_at, 'YYYY-MM-DD').fromNow() : ''}
                      </span>
                    </div>
                    <h3 className="font-bold text-base">
                      <EllipsisText text={item?.video?.caption ?? 'Video Caption'} length={18} />
                    </h3>
                  </div>
                  <ThreeDotVideo
                    className="flex-0"
                    idVideo={item?.video?.id}
                    caption={item?.video?.caption}
                    performer={item?.video?.user?.contestant?.artist_band_name}
                    handleFavorite={() => {
                      setFavoriteVideo([...favoriteVideo, ...[item?.video?.id]]);
                    }}
                    disableFavorite={favoriteVideo?.find((_item) => _item === item?.video?.id)}
                    userID={item?.video?.user_id}
                  />
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <BottomSheetsVote
                    total={item?.video?.votes ?? 0}
                    idVideo={item?.video?.id}
                    idArray={item?.video?.id}
                    stillLoading={isLoading}
                    isActive
                  />
                  <ButtonVote
                    idVideo={item?.video?.id}
                    idArray={item?.video?.id}
                    handleVote={(val) => { }}
                    small
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyVoted />
      )}

      {currentPage < dataVote?.last_page && (
        <div className="flex justify-center items-center mt-3">
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
