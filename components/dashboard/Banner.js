import SkeletonBanner from 'components/skeleton/SkeletonBanner';
import { useGetFtvQuery } from 'core/services/rtk/HomeFeedsServices';
import { useGetAllEventsQuery } from '../../core/services/rtk/EventServices';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function Banner() {
  // const {
  //   data: dataFtv,
  //   isLoading: isLoadingFtv,
  //   error: errorFtv,
  //   isSuccess: isSuccessFtv
  // } = useGetFtvQuery(
  //   {},
  //   {
  //     refetchOnMountOrArgChange: true
  //   }
  // );
  const { allEvents: dataEvents } = useSelector((state) => state.global);

  const [width, setWidth] = useState();

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    setWidth(window.innerWidth);
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 768;

  if (isLoading) {
    return <SkeletonBanner />;
  }

  return (
    <div className="container">
      <div className="flex flex-col gap-5">
        <Link href="/event">
          {/* 
          mobile banner: image
          desktop banner: video_banner
            */}
          <img
            src={`${dataEvents?.data?.data?.length > 0
              ? isMobile
                ? dataEvents?.data?.data[0]?.image || dataEvents?.last_event?.image
                : dataEvents?.data?.data[0]?.video_banner || dataEvents?.last_event?.video_banner
              : isMobile
                ? dataEvents?.last_event?.image
                : dataEvents?.last_event?.video_banner
              }`}
            alt=""
            className="w-full object-cover object-center rounded-[20px]"
            style={{ backgroundColor: '#55607F' }}
            loading="lazy"
          />
        </Link>
      </div>
    </div>
  );
}
