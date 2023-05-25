import { useState } from 'react';
import moment from 'moment';
import EmptyComment from 'components/empty-placeholder/EmptyComment';
import PhotoProfile from './PhotoProfile';

export default function MyComment({ data }) {
  return (
    <div className="flex flex-col gap-7">
      <h3 className="text-lg font-bold pb-3 border-b border-zinc-800">{`Comment ${data?.length}`}</h3>
      <div className="flex flex-col gap-6">
        {
        data?.length > 0 ? (
          data?.map((datas) => (
            <div className="flex gap-4">
              <div className="flex-0">
              <PhotoProfile
              image={datas?.user?.photo ?? '/assets/images/user.png'}
              styles={"w-[52px] h-[52px] rounded-full cursor-pointer"}
              />
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex gap-1 items-center text-xs font-normal">
                  <span className="">{datas?.user?.contestant?.artist_band_name ?? datas?.user?.name}</span>
                  <span>&middot;</span>
                  <span className="">{moment(datas?.created_at).fromNow()}</span>
                </div>
                <h3 className="text-base font-semibold m-0">{datas?.comment}</h3>
              </div>
            </div>
          ))
        ) : ( <EmptyComment /> )}
              </div>
    </div>
  );
}
