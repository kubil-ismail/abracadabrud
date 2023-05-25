import Link from 'next/link';
import BottomSheetsComment from 'components/bottom-sheets/BottomSheetsComment';
import BottomSheetsFavorite from 'components/bottom-sheets/BottomSheetsFavorite';
import BottomSheetsVote from 'components/bottom-sheets/BottomSheetsVote';
import ButtonVote from 'components/element/ButtonVote';
import ThreeDotVideo from 'components/element/ThreeDotVideo';
import { useState } from 'react';
import EllipsisText from 'react-ellipsis-text/lib/components/EllipsisText';
import ReactPlayer from 'react-player/youtube';

export default function VideoUser({ data, name }) {
  const [isOpen, setIsOpen] = useState(false);
  const bandName = data?.user_contestants?.map((item) => item?.artist_band_name)

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-xl md:text-2xl font-bold">{`${name}'s Video`}</h3>
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-slate-50">
          {isOpen && <EmptyVoteModal onClose={() => setIsOpen(false)} />}
          {data?.user_videos?.map(
            (data, index) =>
              data?.video_url !== null && (
                <div className="flex flex-col gap-3 mb-[20px]" key={data?.id}>
                  <div className="w-full h-[191px] md:h-[210px] rounded-[23px] overflow-hidden">
                    <div className="w-full h-full">
                      <ReactPlayer
                        url={data?.video_url}
                        width="100%"
                        height="100%"
                        controls
                        className="w-full h-full"
                        light
                        playing
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-1">
                    <div className="flex justify-between w-full text-slate-50">
                      <div className="flex gap-[10px]">
                        <div className="flex-0">
                          <Link
                            href={`/user/${
                              data?.user?.username ? data?.user?.username : data?.user_id
                            }`}>
                            <div className="w-[52px] h-[52px] rounded-full cursor-pointer">
                              <img
                                src={data?.user?.photo ?? '/assets/images/user.png'}
                                alt=""
                                className="w-full h-full object-cover rounded-full"
                                onError={(e) => {
                                  e.target.src = '/assets/images/user.png';
                                }}
                                loading="lazy"
                              />
                            </div>
                          </Link>
                        </div>
                        <div className="flex-1 flex flex-col gap-2">
                          <div className="flex gap-1 items-center text-xs font-normal">
                            <span className="">{bandName ?? name}</span>
                            <span>&middot;</span>
                            {/* <span className="">{moment(data?.created_at, "YYYYMMDD").fromNow()}</span> */}
                          </div>
                          <EllipsisText
                            text={data?.caption ?? ''}
                            length={28}
                            className="text-[18px] font-extrabold m-0"
                          />
                        </div>
                      </div>
                      <div className="flex-0">
                        <ThreeDotVideo
                          idVideo={data?.id}
                          idArray={data?.id}
                          titleVideo={data?.caption}
                          username={data?.user?.name}
                          userID={data?.user_id}
                          // handleFavorite={() => {
                          //   setLikeList([...likeList, ...[data?.id]]);
                          //   if (!likeList?.find((_item) => _item === data?.id)) {
                          //     setDatas(
                          //       datas?.map((_item) =>
                          //         _item?.video_id === data?.id
                          //           ? {
                          //               ..._item,
                          //               ...{
                          //                 video: {
                          //                   ..._item?.video,
                          //                   total_favorite: _item?.video?.total_favorite + 1
                          //                 }
                          //               }
                          //             }
                          //           : _item
                          //       )
                          //     );
                          //   }
                          // }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="w-[64px] invisible" />
                      <div className="flex gap-3 w-full">
                        <div className="flex-1 flex items-center gap-8 md:gap-6 w-full">
                          <BottomSheetsFavorite
                            total={data?.favorites}
                            idVideo={data?.id}
                            idArray={data?.id}
                          />
                          <BottomSheetsComment
                            total={data?.comments_count}
                            idVideo={data?.id}
                            idArray={data?.id}
                          />
                          <BottomSheetsVote
                            total={data?.votes}
                            idVideo={data?.id}
                            idArray={data?.id}
                          />
                        </div>
                        <div className="flex-0">
                          <ButtonVote idVideo={data?.id} idArray={data?.id} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
}
