import React from 'react';
import moment from 'moment';
import { useRouter } from 'next/router';

export default function EventMyPoint({ data, total }) {
  const { locale } = useRouter();
  const isOngoing = data?.data?.data[0] ? true : false;
  const showTooltip = () => {
    const tooltip = document.getElementById('tooltip-default');
    tooltip.classList.remove('opacity-0');
    tooltip.classList.add('opacity-100');
  };

  const hideTooltip = () => {
    const tooltip = document.getElementById('tooltip-default');
    tooltip.classList.remove('opacity-100');
    tooltip.classList.add('opacity-0');
  };

  return (
    <div className=" bg-[#313131] text-slate-50 p-4 rounded-lg">
      <div className="flex justify-between items-center w-full">
        <div className="">
          <img
            src={isOngoing ? data?.data?.data[0]?.image : data?.last_event?.image}
            alt="thumbnail"
            className="w-20 h-14 object-cover rounded-lg"
          />
        </div>
        <div className="flex flex-col ml-3">
          <h3 className="m-0 text-[12px] md:text-[14px] font-medium two-line">{
            isOngoing ? data?.data?.data[0]?.title :
              data?.last_event?.title
          }</h3>

          <span className="text-[10px] font-light">
            {isOngoing ? moment(data?.data?.data[0]?.start_date).format('DD MMMM YYYY') :
              moment(data?.last_event?.start_date).format('DD MMMM YYYY')} -{' '}
            {isOngoing ? moment(data?.data?.data[0]?.end_date).format('DD MMMM YYYY') :
              moment(data?.last_event?.end_date).format('DD MMMM YYYY')}
          </span>
        </div>
        <div className="bg-[#D7005A] relative p-2 flex items-center justify-center rounded-lg text-[12px]"
          onMouseOver={showTooltip}
          onMouseLeave={hideTooltip}
        >
          <div id="tooltip-default" role="tooltip" class="absolute z-10 inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 dark:bg-gray-700 -top-10">
            {new Intl.NumberFormat(locale, {
              notation: 'standard',
              compactDisplay: 'short',
            }).format(total)}
            <div class="tooltip-arrow" data-popper-arrow></div>
          </div>
          <span className="font-bold">{new Intl.NumberFormat(locale, {
            notation: total >= 10000 ? 'compact' : 'standard',
            compactDisplay: 'short',
            roundingMode: total >= 10000 ? 'floor' : 'halfExpand',
            trailingZeroDisplay: 'stripIfInteger',
            maximumFractionDigits: 1
          }).format(total)
          } Points</span>
        </div>
      </div>
    </div>
  );
}
