import React, { useState } from 'react';
import EllipsisText from 'react-ellipsis-text';
import moment from 'moment';
import Username from './Username';

export default function VideoVoteHistory({ data }) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <img
          src={data?.video?.user?.photo}
          onError={(e) => {
            e.target.src = '/assets/images/user.png';
          }}
          alt="banner"
          className="w-14 h-14 rounded-full object-cover"
        />
        <div className="flex-1 flex flex-col">
          <h3 className="text-sm font-bold m-0">
            <EllipsisText text={data?.video?.caption ?? 'title'} length={32} />
          </h3>
          <div className="flex space-x-1 items-center">
            <Username name={data?.video?.user?.contestant?.artist_band_name} fontStyle="text-xs font-light" />
            {/* <span className="text-xs font-light">
              {data?.video?.user?.contestant?.artist_band_name}
            </span> */}
            <span className="text-center flex justify-center">&middot;</span>
            <span className="text-xs font-light">
              {moment(data?.created_at).fromNow()}
            </span>
          </div>
        </div>
      </div>
      <div className="flex-0">
        <div className="text-xs font-semibold px-3 py-2 rounded-md bg-[#D7005A] text-slate-50">{`${data?.vote} Vote`}</div>
      </div>
    </div>
  );
}
