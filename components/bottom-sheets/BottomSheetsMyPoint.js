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

export default function BottomSheetsMyPoint(props) {
  const timestampRef = useRef(Date.now()).current;
  const [open, setOpen] = useState(false);
  const [myPoints, setMyPoints] = useState(0);
  const [pageHistoryPoint, setPageHistoryPoint] = useState(1);
  const [historyPointDatas, setHistoryPointDatas] = useState([]);
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

  const { data: dataHistoryPoint,
    isLoading: dataHistoryPointLoading
  } = useGetHistoryPointQuery(
    {
      page: pageHistoryPoint,
      pageSize: 10,
      sessionId: timestampRef
    },
    {
      skip: !isAuthenticated || !open,
    }
  );

  const dataPoint = myPoint || {};

  useEffect(() => {
    if (isAuthenticated) {
      // fix invalid counting point
      // setMyPoints(data?.data[0]?.user_state?.current_point);
      setMyPoints(dataPoint?.total);
    }
  }, [data, isAuthenticated, dataHistoryPoint, dataPoint]);

  useEffect(() => {
    if (!isAuthenticated) setHistoryPointDatas([]);
  }, [isAuthenticated]);

  useEffect(() => {
    if (open) {
      dispatch(pointApi.util.invalidateTags('HistoryPoint'));
      setPageHistoryPoint(1);
      setHistoryPointDatas([]);
    }
  }, [open]);

  useEffect(() => {
    if (isAuthenticated) {
      setHistoryPointDatas(
        [...historyPointDatas, ...(dataHistoryPoint?.data ?? [])].filter(
          (value, index, array) => array.findIndex((_value) => _value.id === value.id) === index
        )
      );
    }
  }, [dataHistoryPoint]);

  function kFormatter(num) {
    return Math.abs(num) > 999
      ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + 'k'
      : Math.sign(num) * Math.abs(num);
  }

  return (
    <div>
      <div
        className="flex flex-col gap-1 items-center cursor-pointer"
        aria-hidden
        onClick={() => setOpen(!open)}>
        <span className="text-xl md:text-2xl font-normal h-[31px] pt-[2px]">
          {isAuthenticated && dataPoint?.total ? (
            <span className="font-normal">
              {kFormatter(myPoints)}
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
        header={<div className="font-semibold py-2 text-base">Point History</div>}
        snapPoints={({ maxHeight }) => 0.8 * maxHeight}>
        {isAuthenticated ? (
          <div className="mx-3 flex flex-col gap-7">
            {/* <EmptyPoint /> */}
            {dataEvents && (
              <div className="flex flex-col gap-3">
                <h3 className="text-[14px] font-bold mb-2">Event List</h3>
                <EventMyPoint data={dataEvents} total={myPoints} />
              </div>
            )}
            <div className="flex flex-col gap-3">
              <h3 className="text-[14px] font-bold mb-2">Activities</h3>
              {historyPointDatas.length > 0 ? (
                historyPointDatas
                  ?.filter((res) => res?.source_point_id !== 'move_general_to_event_point')
                  ?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                  ?.map((item) => <HistoryPoint data={item} />)
              ) : (
                <EmptyPoint />
              )}
              {pageHistoryPoint < dataHistoryPoint?.last_page && (
                <button
                  className="text-zinc-400 rounded-md focus:outline-none text-sm font-normal flex justify-center mb-10 mt-5"
                  onClick={() => {
                    const next = pageHistoryPoint + 1;
                    setPageHistoryPoint(next);
                  }}
                  disabled={dataHistoryPointLoading}>
                  {dataHistoryPointLoading ? 'Loading...' : 'Load More'}
                </button>
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
