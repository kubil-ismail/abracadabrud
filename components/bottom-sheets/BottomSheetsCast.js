import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { useGetMyVoteQuery } from '../../core/services/rtk/MeServices';
import VideoVoteHistory from '../element/VideoVoteHistory';
import EmptyVoted from '../empty-placeholder/EmptyVoted';
import { useTranslation } from 'react-i18next';

export default function BottomSheetsCast(props) {
  const timestampRef = useRef(Date.now()).current;
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [available_vote, setAvailableVote] = useState(0);
  const [vote_use, setVoteUse] = useState(0);

  const [pageVoteHistory, setPageVoteHistory] = useState(1);
  const [voteHistoryData, setVoteHistoryData] = useState([]);
  const { isAuthenticated } = useSelector((state) => state.authentication);
  const { myPoint } = useSelector((state) => state.points);
  const data = myPoint ?? {};

  const { data: dataVote, isLoading: dataVoteLoading } = useGetMyVoteQuery(
    {
      page: pageVoteHistory,
      pageSize: 10,
      sessionId: timestampRef
    },
    {
      skip: !isAuthenticated || !open
    }
  );

  useEffect(() => {
    if (isAuthenticated) {
      setAvailableVote(data?.remaining);
      setVoteUse(data?.total_usage);
    }
  }, [data, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) setVoteHistoryData([]);
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      setVoteHistoryData(
        [...voteHistoryData, ...(dataVote?.data ?? [])].filter(
          (value, index, array) => array.findIndex((_value) => _value.id === value.id) === index
        )
      );
    }
  }, [dataVote]);

  function kFormatter(num) {
    return Math.abs(num) > 999
      ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + 'k'
      : Math.sign(num) * Math.abs(num);
  }

  return (
    <div>
      <div
        className="flex flex-col gap-1 items-center item-pointer"
        aria-hidden
        onClick={() => setOpen(!open)}>
        <div className="h-[31px] flex items-center gap-1">
          {isAuthenticated && data?.remaining ? (
            <span
              className={
                available_vote?.toString().split('')?.length <= 2 &&
                vote_use?.toString().split('')?.length <= 2
                  ? 'font-medium text-xl md:text-2xl'
                  : 'font-medium text-[15px]'
              }>
              {kFormatter(available_vote)}
            </span>
          ) : vote_use?.toString().split('')?.length > 2 ? (
            <small className="font-normal text-[15px]">0</small>
          ) : (
            <small className="font-normal text-xl md:text-2xl">0</small>
          )}
          {'/'}
          {isAuthenticated && data?.total_usage ? (
            <small
              className={
                available_vote?.toString().split('')?.length <= 2 &&
                vote_use?.toString().split('')?.length <= 2
                  ? 'font-medium text-xl md:text-2xl'
                  : 'font-medium text-[15px]'
              }>
              {kFormatter(vote_use)}
            </small>
          ) : isAuthenticated &&
            data?.remaining &&
            available_vote?.toString().split('')?.length > 2 ? (
            <small className="font-normal text-[15px]">0</small>
          ) : (
            <small className="font-normal text-xl md:text-2xl">0</small>
          )}
        </div>
        <span className="text-[10px] font-light text-center">{t('Available / Cast Votes')}</span>
      </div>
      <BottomSheet
        open={open}
        onDismiss={() => setOpen(false)}
        header={<div className="font-semibold py-2 text-base">Video Vote History</div>}
        snapPoints={({ maxHeight }) => 0.8 * maxHeight}>
        {isAuthenticated ? (
          <div className="flex flex-col gap-7 mx-4 my-5">
            <div className="flex flex-col gap-5">
              {voteHistoryData.length > 0 ? (
                voteHistoryData.map((item) => <VideoVoteHistory key={item?.id} data={item} />)
              ) : (
                <EmptyVoted />
              )}
            </div>

            {pageVoteHistory < dataVote?.last_page && (
              <button
                className="text-zinc-400 rounded-md focus:outline-none text-sm font-normal flex justify-center mb-10 mt-5"
                onClick={() => {
                  const next = pageVoteHistory + 1;
                  setPageVoteHistory(next);
                }}
                disabled={dataVoteLoading}>
                {dataVoteLoading ? 'Loading...' : 'Load More'}
              </button>
            )}
          </div>
        ) : (
          <EmptyVoted />
        )}
      </BottomSheet>
    </div>
  );
}
