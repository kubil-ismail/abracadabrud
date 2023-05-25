import React, { useState } from 'react';
import EllipsisText from 'react-ellipsis-text';
import activityNamingResolve from '../../core/utils/activityNamingResolve';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

export default function HistoryPoint({ data }) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const getDescription = (activity) => {
    if (activity?.source_point_id) {
      return activityNamingResolve('points', activity.source_point_id, activity);
    }
    return '';
  };

  return (
    <div className="bg-[#313131] text-slate-50 rounded-lg p-4 flex flex-col gap-3 relative">
      <div className="flex justify-between w-full">
        <div className="flex flex-col gap-1">
          {/* <h3 className="text-xs font-semibold">
            {data?.event?.title ?? data?.point_source_name ?? 'Event Title '}
          </h3> */}
          <span className="text-[14px] font-medium">
            <EllipsisText text={t(getDescription(data)) ?? 'source point'} length={100} />
          </span>
        </div>
        <div className="">
          <div className="bg-[#BFFFC6] text-[#16A626] rounded-md px-3 py-2 flex items-center justify-center text-xs font-bold">
            {`+ ${data?.point_value} points`}
          </div>
        </div>
        {data?.multiplier > 1 && (
          <div className="absolute top-1 right-2 text-[6px] p-1 bg-[#F59E4E] text-slate-50 inline-flex font-bold rounded-md">
            {`Multiplier ${data?.multiplier}x`}
          </div>
        )}
      </div>
      <span className="text-[10px] font-light">{moment(data?.created_at).format('LLL')}</span>
    </div>
  );
}
