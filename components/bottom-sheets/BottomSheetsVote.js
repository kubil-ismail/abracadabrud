import React, { useEffect, useState } from 'react';
import service from 'core/services/publicService';
import { BottomSheet } from 'react-spring-bottom-sheet';
import moment from 'moment';
import Username from 'components/element/Username';
import EmptyVotedVideo from 'components/empty-placeholder/EmptyVotedVideo';
import { useRouter } from 'next/router';

export default function BottomSheetsVote({ total, idVideo, stillLoading, isActive }) {
  const [open, setOpen] = useState(false);
  const [totalVote, setTotalVote] = useState(total);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isError, setIsError] = useState(false);
  const [page, setPage] = useState(1);
  const [totalData, setTotalData] = useState(1);
  const [datas, setDatas] = useState([]);
  const { locale } = useRouter();

  useEffect(() => {
    if (open) {
      service
        .get(`${process.env.NEXT_PUBLIC_SITE_URL}/api/videos/${idVideo}/get-votes?page=1`)
        .then(({ data }) => {
          setDatas(data?.data ?? []);
          setPage(1);
          setTotalData(data?.last_page);
          setIsError(false);
        })
        .catch(() => setIsError(true))
        .finally(() => setIsFetching(false));
    }
  }, [open, idVideo]);

  const handleNextPage = (next) => {
    setIsLoading(true);
    service
      .get(`${process.env.NEXT_PUBLIC_SITE_URL}/api/videos/${idVideo}/get-votes?page=${next}`)
      .then(({ data }) => {
        setDatas([...datas, ...data?.data]);
        setPage(next);
        setTotalData(data?.last_page);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    setTotalVote(total);
  }, [total]);

  return (
    <div>
      <div
        className="flex space-x-2 items-center text-sm cursor-pointer"
        onClick={() => setOpen(!open)}>
        <img
          src={
            isActive
              ? `${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/vote-icon-active.svg`
              : `${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/vote-icon.svg`
          }
          alt="vote-icon"
          className="w-[16px] flex-0"
          loading="lazy"
          width="100%"
          height="100%"
        />
        <button className="flex-1 text-small">
          {new Intl.NumberFormat(locale, {
            notation: totalVote >= 10000 ? 'compact' : 'standard',
            compactDisplay: 'short',
            roundingMode: totalVote >= 10000 ? 'floor' : 'halfExpand',
            trailingZeroDisplay: 'stripIfInteger',
            maximumFractionDigits: 1
          }).format(totalVote)}
        </button>
      </div>
      <BottomSheet
        open={open}
        onDismiss={() => setOpen(false)}
        header={
          <div className="font-semibold py-2 text-base">
            History
            {` (${new Intl.NumberFormat(locale, {
              notation: totalVote >= 10000 ? 'compact' : 'standard',
              compactDisplay: 'short',
              roundingMode: totalVote >= 10000 ? 'floor' : 'halfExpand',
              trailingZeroDisplay: 'stripIfInteger',
              maximumFractionDigits: 1
            }).format(totalVote)})`}
          </div>
        }
        snapPoints={({ maxHeight }) => 0.8 * maxHeight}>
        <div className="flex flex-col space-y-5 p-4" id="bottomVote">
          {isFetching && (
            <div className="flex justify-center items-center mt-52">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            </div>
          )}
          {isError && !isFetching && (
            <div className="flex justify-center items-center">
              <p className="text-sm text-red-500">Something went wrong</p>
            </div>
          )}
          {datas?.length > 0 ? (
            <>
              {datas?.map((item, index) => (
                // <UserInfo label="vote" data={item} key={index} />
                <div className="flex items-center mb-1 space-x-4" key={item?.id}>
                  <div className="flex-0">
                    <img
                      src={item?.photo}
                      onError={(e) => {
                        e.target.src = '/assets/images/user.png';
                      }}
                      className="w-12 h-12 rounded-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 flex flex-col space-x-1">
                    <div className="text-xs font-normal">
                      <Username
                        name={item?.artist_band_name ?? item?.firstname}
                        fontStyle={'font-bold'}
                      />{' '}
                      •{' '}
                      {/* <span className="font-bold">{item?.artist_band_name ?? item?.firstname} </span> •{' '} */}
                      {moment(item?.created_at).fromNow()}
                    </div>
                    <span className="text-green-500">+{item?.vote} Vote</span>
                  </div>
                </div>
              ))}
              {page < totalData && (
                <button
                  className="text-zinc-400 rounded-md focus:outline-none text-sm font-normal flex justify-center"
                  onClick={() => {
                    const next = page + 1;
                    handleNextPage(next);
                  }}>
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-200"></div>
                  ) : (
                    'Load more'
                  )}
                </button>
              )}
            </>
          ) : !isFetching ? (
            <EmptyVotedVideo />
          ) : null}
        </div>
      </BottomSheet>
    </div>
  );
}
