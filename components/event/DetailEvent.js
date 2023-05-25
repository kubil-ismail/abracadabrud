import { useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import parse from 'html-react-parser';
// import ReactHtmlParser from 'react-html-parser';
import { BsCalendarDate } from 'react-icons/bs';
import { useGetEventsQuery, useGetEventQuery } from '../../core/services/rtk/EventServices';
import { useRouter } from 'next/router';
import moment from 'moment';

export default function DetailEvent() {
  const { data, error, isLoading } = useGetEventsQuery({},
    {
      refetchOnMountOrArgChange: true
    }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  if (!data || !data.data?.data) {
    return (
      <div>
        <h3 className="font-bold text-2xl text-[#6CFF00]">Current Event</h3>
        <p>No Event</p>
      </div>
    );
  }

  const router = useRouter();

  return (
    <div className="flex flex-col gap-3 mt-5">
      <div className="flex flex-col gap-3">
        {data.data.data.map((event) => (
          <h3 className="text-lg font-bold" key={event?.id}>
            {event?.title}
          </h3>
        ))}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#302C2C]">
            <BsCalendarDate className="text-slate-50" />
          </div>
          <div className="">
            {data.data.data.map((event) => (
              <span className="text-xs font-semibold" key={event?.id}>
                {moment(event?.start_date).format('ll')}
              </span>
            ))}{' '}
            -{' '}
            {data.data.data.map((event) => (
              <span className="text-xs font-semibold" key={event?.id}>
                {moment(event?.end_date).format('ll')}
              </span>
            ))}
          </div>
        </div>
      </div>
      {data.data.data.map((event) => (
        <div className="text-sm font-light list flex flex-col gap-3" key={event.id}>
          {parse(event?.description)}
        </div>
      ))}
    </div>
  );
}
