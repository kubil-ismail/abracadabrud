

import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function WinnerNotification({ data }) {
  const { t } = useTranslation();

  //   const typeName = type === 'membership' ? 'membership' : 'video';

  return (
    <div
      className={`${data?.read ? 'bg-[#3a383e]' : 'bg-[#404040]'} mt-2 p-4 hover:bg-[#3a383e] text-slate-50 shadow-[-1px_2px_14px_-1px_rgba(0,0,0,0.04)] rounded-lg transition-all ease-in-out delay-75 cursor-pointer`}
      aria-hidden
    >
      <div className="flex flex-col">
        <div className="inline-flex mb-3">
          <span
            className="text-[8px] md:text-[10px] border-2 border-[#FF00FE] text-[#FF00FE] px-2 py-1 rounded-full"
          >
            Wepop come together
          </span>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-none">
            <div className="flex flex-col gap-1 items-center">
              <div>
                <img src="/assets/images/mahkota.webp" alt="crown" className="w-6" />
              </div>
              <div className="flex flex-col gap-1 items-center">
                <img src="/assets/images/user.png" alt="crown" className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover object-center" />
                <span className="text-[8px] md:text-xs text-gray-200">Alicya Warens</span>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex flex-col">
              <div className="inline-flex mb-1">
                <span className="text-[8px] md:text-[10px] border-2 border-[#10FF00] text-[#10FF00] px-2 py-1 rounded-full">
                  19 Mar 2023 - 26 Mar 2023
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <h4
                  className="text-[10px] md:text-xs text-[#06B66C] m-0 font-medium"
                >
                  #WinnerAnnouncement
                </h4>
                <h3 className="text-xs lg:text-sm font-medium m-0">
                  <span
                    className="text-slate-50"
                  >
                    Alicya Warens has winning [prize] based on Most Voted.
                  </span>
                </h3>
                <div className="flex justify-end">
                  <span className="text-[8px] lg:text-[10px] text-gray-200">
                    21/03/2023
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}