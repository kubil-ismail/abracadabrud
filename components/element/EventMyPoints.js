import React from 'react';
import moment from 'moment';

export default function EventMyPoint({ data }) {
  function kFormatter(num) {
    return Math.abs(num) > 999
      ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + 'k'
      : Math.sign(num) * Math.abs(num);
  }

  return (
    <div className=" bg-[#313131] text-slate-50 p-4 rounded-lg">
      <div className="flex justify-between items-center w-full">
        <div className="">
          <img
            src={data?.data?.event_image_banner}
            alt="thumbnail"
            className="w-20 h-14 object-cover rounded-lg"
          />
        </div>
        <div className="flex flex-col ml-3">
          <h3 className="m-0 text-[12px] md:text-[14px] font-medium two-line">{data?.data?.event_title}</h3>

          <span className="text-[10px] font-light">
            {moment(data?.data?.event_start_date).format('DD MMMM YYYY')} -{' '}
            {moment(data?.data?.event_end_date).format('DD MMMM YYYY')}
          </span>
        </div>
        <div className="invisible bg-[#D7005A] p-2 flex items-center justify-center rounded-lg text-[12px]">
          <span className="font-bold">{kFormatter(data?.data?.total_points)} Points</span>
        </div>
      </div>
    </div>
  );
}
