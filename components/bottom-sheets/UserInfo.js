import React from 'react';
import moment from 'moment/moment';
import PhotoProfile from 'components/element/PhotoProfile';
import Username from 'components/element/Username';

export default function UserInfo({ label, data }) {
  return (
    <div className="flex items-center mb-1 space-x-4">
      <div className="flex-0">
        <PhotoProfile
        image={data?.photo ?? '/assets/images/user.png'}
        styles="w-12 h-12"
        />
        {/* <img
          src={data?.photo}
          onError={(e) => {
            e.target.src = '/assets/images/user.png';
          }}
          className="w-12 h-12 rounded-full object-cover"
        /> */}
      </div>
      <div className="flex-1 flex flex-col space-x-1">
        <div className="text-xs font-normal">
          <Username name={data?.contestant?.artist_band_name ?? data?.name} fontStyle="font-bold" /> •{' '}
          {/* <span className="font-bold">{data?.user?.firstname || data?.contestant?.artist_band_name} </span> •{' '} */}
          {moment(data?.created_at).fromNow()}
        </div>
        {label === 'favorite' && <span className="text-xs">Added this video to favorite</span>}
        {label === 'vote' && <span className="text-green-500">+{data?.vote} Vote</span>}
        {label === 'comment' && (
          <span className="text-xs">The best cover i've seen in the world.</span>
        )}
      </div>
    </div>
  );
}
