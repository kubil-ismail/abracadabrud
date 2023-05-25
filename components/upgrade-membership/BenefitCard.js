import { useRouter } from 'next/router';
import { useState } from 'react';

export default function BenefitCard() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-5 bg-[#6CFF00] text-[#0000FF] p-5 rounded-2xl">
        <div className="flex flex-col items-center ">
          <h3 className="font-bold text-2xl">Premium Membership</h3>
          <span className="font-light text-2xl">Rp 29,900 /week</span>
        </div>
        <span className="font-light text-sm">
          We're excited to announce our latest upgrade membership event! By upgrading your
          membership today, not only will you gain access to exclusive perks and benefits, but
          you'll also have the chance to win some amazing prizes.
        </span>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <img src="/assets/images/checklist.png" alt="checklist" className="w-8" />
            <span className="text-sm font-light">Get 10 votes every weekend</span>
          </div>
          <div className="flex items-center gap-3">
            <img src="/assets/images/checklist.png" alt="checklist" className="w-8" />
            <span className="text-sm font-light">1 diamond for vote weekly</span>
          </div>
          <div className="flex items-center gap-3">
            <img src="/assets/images/checklist.png" alt="checklist" className="w-8" />
            <span className="text-sm font-light">1 diamond for vote weekly</span>
          </div>
          <div className="flex items-center gap-3">
            <img src="/assets/images/checklist.png" alt="checklist" className="w-8" />
            <span className="text-sm font-light">1 diamond for vote weekly</span>
          </div>
        </div>
      </div>
      <div className="">
        <button
          type="button"
          className="p-3 bg-[#6CFF00] text-[#0000FF] rounded-md w-full font-bold"
        >
          Upgrade Membership Now!
        </button>
      </div>
    </div>
  );
}
