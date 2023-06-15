import { BottomSheet } from 'react-spring-bottom-sheet';
import React, { useEffect, useState, useRef } from 'react';
import EmptyPoint from '../empty-placeholder/EmptyPoint';
import HistoryPoint from '../element/HistoryPoints';
import EventMyPoint from '../element/EventMyPoints';
import {
  useGetHistoryPointQuery,
  useGetMyEventsQuery,
  useGetCurrentEventQuery,
  pointApi
} from 'core/services/rtk/MeServices';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import service from 'core/services/publicService';

export default function BottomSheetsMyPoint(props) {
  const { t } = useTranslation();
  const timestampRef = useRef(Date.now()).current;
  const [open, setOpen] = useState(false);
  const [myPoints, setMyPoints] = useState(0);
  const [pageHistoryPoint, setPageHistoryPoint] = useState(1);
  const [historyPointDatas, setHistoryPointDatas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [dataHistoryPoint, setDataHistoryPoint] = useState(null);
  const { isAuthenticated } = useSelector((state) => state.authentication);
  const { myPoint } = useSelector((state) => state.points);
  const dataEvents = useSelector((state) => state.global.allEvents);
  const dispatch = useDispatch();

  const { data } = useGetMyEventsQuery(
    {},
    {
      skip: !isAuthenticated,
      refetchOnFocus: true
    }
  );

  const dataPoint = myPoint || {};

  useEffect(() => {
    if (isAuthenticated) {
      // fix invalid counting point
      // setMyPoints(data?.data[0]?.user_state?.current_point);
      setMyPoints(dataPoint?.total);
    }
  }, [data, isAuthenticated, dataPoint]);

  useEffect(() => {
    if (!isAuthenticated) setHistoryPointDatas([]);
  }, [isAuthenticated]);

  useEffect(() => {
    if (open && isAuthenticated) {
      setLoading(true);
      setPageHistoryPoint(1);
      setHistoryPointDatas([]);
      setLoadingFetch(true);
      setTimeout(() => {
        service
          .get(
            `${
              process.env.NEXT_PUBLIC_SITE_URL
            }/api/me/point-activity?page=${pageHistoryPoint}&page_size=${5}`
          )
          .then((result) => {
            setHistoryPointDatas(
              [...historyPointDatas, ...(result?.data ?? [])].filter(
                (value, index, array) =>
                  array.findIndex((_value) => _value.id === value.id) === index
              )
            );

            setDataHistoryPoint(result);
          })
          .finally(() => {
            setLoading(false);
            setLoadingFetch(false);
          });
      }, 500);
    } else {
      setPageHistoryPoint(1);
      setHistoryPointDatas([]);
      setDataHistoryPoint(null);
    }
  }, [open]);

  const handleNext = (next) => {
    if (next > 1) {
      setLoading(true);
      service
        .get(
          `${process.env.NEXT_PUBLIC_SITE_URL}/api/me/point-activity?page=${next}&page_size=${5}`
        )
        .then((result) => {
          setHistoryPointDatas(
            [...historyPointDatas, ...(result?.data ?? [])].filter(
              (value, index, array) => array.findIndex((_value) => _value.id === value.id) === index
            )
          );

          setPageHistoryPoint(next);
          setDataHistoryPoint(result);
        })
        .finally(() => {
          setLoading(false);
          setLoadingFetch(false);
        });
    }
  };

  return (
    <div>
      <div
        className="flex flex-col space-x-1 items-center cursor-pointer"
        aria-hidden
        onClick={() => setOpen(!open)}>
        <span className="text-xl md:text-2xl font-normal h-[31px] pt-[2px]">
          {isAuthenticated && dataPoint?.total ? (
            <span className="font-normal">
              {new Intl.NumberFormat('en-US', {
                notation: 'compact',
                compactDisplay: 'short',
                roundingMode: 'floor',
                maximumFractionDigits: 1
              }).format(myPoints)}
            </span>
          ) : (
            <span className="font-medium">0</span>
          )}
        </span>
        <span className="text-[10px] font-light">Points</span>
      </div>
      <BottomSheet
        open={open}
        onDismiss={() => setOpen(false)}
        header={<div className="font-semibold py-2 text-base">{t('Point History')}</div>}
        snapPoints={({ maxHeight }) => 0.8 * maxHeight}>
        {isAuthenticated ? (
          <div className="mx-3 flex flex-col space-y-7">
            {/* <EmptyPoint /> */}
            {dataEvents && (
              <div className="flex flex-col space-y-3">
                <h3 className="text-[14px] font-bold mb-2">{t('Event List')}</h3>
                <EventMyPoint data={dataEvents} total={myPoints} />
              </div>
            )}

            <h3 className="text-[14px] font-bold mb-2">{t('Activities')}</h3>

            <div className="flex flex-col space-y-3">
              {loadingFetch ? (
                [...new Array(5)].map((item) => (
                  <div className="bg-[#313131] text-slate-50 rounded-lg p-4 flex flex-col gap-3 relative">
                    <div role="status" class="flex items-center justify-between animate-pulse">
                      <div>
                        <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-60 mb-2"></div>
                        <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-60 mb-2.5"></div>
                        <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                      </div>
                      <div class="h-12 bg-gray-300 rounded dark:bg-gray-700 w-16"></div>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  {historyPointDatas.length > 0 ? (
                    historyPointDatas
                      ?.filter((res) => res?.source_point_id !== 'move_general_to_event_point')
                      ?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                      ?.map((item) => <HistoryPoint data={item} />)
                  ) : (
                    <EmptyPoint />
                  )}
                  {pageHistoryPoint < dataHistoryPoint?.last_page  && (
                    <button
                      className="text-zinc-400 rounded-md focus:outline-none text-sm font-normal flex justify-center mb-10 mt-6 pb-5"
                      onClick={() => {
                        const next = pageHistoryPoint + 1;

                        handleNext(next);
                      }}
                      disabled={loading}>
                      {loading ? 'Loading...' : `${t('Load More')}`}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ) : (
          <EmptyPoint />
        )}
      </BottomSheet>
    </div>
  );
}
