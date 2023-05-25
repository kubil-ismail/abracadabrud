import Head from 'next/head';
import Image from 'next/image';

export default function PreviousEvent() {
  return (
    <div className="container">
      <div className="flex flex-col gap-5">
        <h3 className="font-bold text-2xl text-[#6CFF00]">Previous Event</h3>
        <div className="w-full h-[255px] rounded-lg relative">
          <img
            src="/assets/images/banner-event.png"
            alt=""
            className="w-full h-full object-cover rounded-lg brightness-50"
          />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-slate-50">
            <div className="flex flex-col gap-1 items-center">
              <h3 className="text-lg font-bold m-0">Justin Bieber Live</h3>
              <span className="text-base font-light">14 Maret 2023</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
