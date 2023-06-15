import { useRouter } from 'next/router';
import { useState } from 'react';
import SponsorLogo from './SponsorLogo';
import { useTranslation } from 'react-i18next';

export default function SponsorInformation() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <div className="flex flex-col space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
        <div className="">
          <img
            src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/benefit-contestant.png`}
            alt="benefit-ilustration"
            className="w-full"
          />
        </div>
        <div className="flex flex-col space-y-4 md:space-y-5">
          <h3 className="text-5xl text-center md:text-left text-[#23FF2C] font-extrabold m-0">
            Connecting Fans, Bands and Brands.
          </h3>
          <span className="text-sm md:text-base w-full">
            {t('Check out wePOP’s amazing sponsors! Every day you watch one of their videos you will earn 5 points. Use those points to vote and win amazing prizes!')}
          </span>
        </div>
      </div>
      <SponsorLogo className="mt-8" />
    </div>
  );
}
