import PhotoProfile from 'components/element/PhotoProfile';
import Username from 'components/element/Username';
import resolveImage from 'lib/resolveImage';
import { useState, useEffect } from 'react';
export default function ProfileUser({ data }) {
  const [membership, setMembership] = useState(0);
  return (
    <div className=" -mt-16 md:-mt-44">
      <div className="flex flex-col w-full items-center gap-5">
        <PhotoProfile image={data?.user?.photo ?? '/assets/images/user.png'} styles="h-32 w-32 md:w-64 md:h-64 border-4 border-white" />
        {/* <img
                    src={data?.user?.photo ?? '/assets/images/user.png'}
                    alt="photo"
                    className="h-40 w-40 md:w-64 md:h-64 rounded-full object-cover border-4 border-white"
                    onError={(e) => e.target.src = "/assets/images/user.png"}
                  /> */}
        <Username name={data?.user_contestants[0]?.artist_band_name ? data?.user_contestants[0]?.artist_band_name : data?.user?.name} fontStyle="text-2xl font-bold" />
      </div>
      {/* <h3 className="text-2xl font-bold">{ data?.user_contestants[0]?.artist_band_name ?  data?.user_contestants[0]?.artist_band_name : data?.user?.name}</h3> */}
    </div>
  );
}
