import { t } from 'i18next';
import { useState } from 'react';

export default function SponsorLogo() {
  return (
    // <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
    //   <img src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/oreo-logo.png`} alt="" className="w-32 md:w-56 m-auto" />
    //   <img src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/kfc-logo.png`} alt="" className="w-32 md:w-56 m-auto" />
    //   <img src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/coca-cola-logo.png`} alt="" className="w-32 md:w-56 m-auto" />
    //   <img src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/nestle-logo.png`} alt="" className="w-32 md:w-56 m-auto" />
    // </div>
    <div className="flex flex-col space-y-16 text-center">
      <div className="flex flex-col space-y-8">
        <h3 className="font-bold text-2xl">{t('Presented By')}</h3>
        <div className="flex items-center justify-center w-full">
        <div className="bg-white p-5 rounded-md">
            <img src={`/assets/images/allobank.png`} alt="" className="w-32 md:w-44 max-h-16 m-auto" />      
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-8">
        <h3 className="font-bold text-2xl">{t('Partners Include:')}</h3>
        <div className="max-w-2xl md:m-auto grid grid-cols-2 gap-5 items-center">
          <div className="bg-white p-5 rounded-md">
            <img src={`/assets/images/pepsodent.svg`} alt="" className="w-32 md:w-44 max-h-16 m-auto" />      
          </div>
          <div className="bg-white p-5 rounded-md">
            <img src={`/assets/images/aqua-logo.png`} alt="" className="w-32 md:w-44 max-h-16 m-auto" />      
          </div>
          <div className="bg-white p-5 rounded-md">
            <img src={`/assets/images/samsung.png`} alt="" className="w-32 md:w-44 max-h-16 m-auto" />      
          </div>
          <div className="bg-white p-5 rounded-md">
            <img src={`/assets/images/wardah.png`} alt="" className="w-32 md:w-44 max-h-16 m-auto" />      
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-8">
        <h3 className="font-bold text-2xl">{t('Supported By:')}</h3>
        <div className="max-w-2xl md:m-auto grid grid-cols-2 gap-5 items-center">
        <div className="bg-white p-5 rounded-md">
            <img src={`/assets/images/telkomsel.png`} alt="" className="w-32 md:w-44 max-h-16 m-auto" />      
          </div>
          <div className="bg-white p-5 rounded-md">
            <img src={`/assets/images/garuda.png`} alt="" className="w-32 md:w-44 max-h-16 m-auto" />      
          </div>
        </div>
      </div>
    </div>
  );
}
