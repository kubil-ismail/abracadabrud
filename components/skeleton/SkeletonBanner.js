import { useGetEventsQuery } from 'core/services/rtk/EventServices';
import Head from 'next/head';
import Image from 'next/image';

export default function SkeletonBanner() {
  return (
    <div className="container">
      <div className="bg-[#686868] animate-pulse w-full h-[637px] md:h-[420px] rounded-[20px]" />
    </div>
  );
}
