import { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
export default function Rules() {
  const { t } = useTranslation();
  return (
    <div className="container flex flex-col gap-5">
      <h3 className="text-4xl text-[#23FF2C] text-center font-extrabold m-auto">
        {t('Upload your video, get the most votes, and join us on the main stage with your idols.')}
      </h3>
      <p className="text-xl text-center font-normal m-auto text-slate-50">
        {t('Voting for videos and winning weekly prizes 3 June through July 21 2023.')}
      </p>
      <p className="text-xl font-semibold text-[#FF00FE]">{t('Video Rules')}</p>
      <div className="px-5">
        <ul className="list-decimal text-[#fff] font-normal text-xl flex flex-col gap-[0.813rem]">
          <li>
            {/* {t(
              'Create a music video in which you sing your own original song or a song made famous, Judika, Rizky Febian, BCL, and Kahitna.'
            )} */}
            {t(
              "Create a music video in which you sing your own original song or a song from the event's artists"
            )}
          </li>
          <li>{t('You can perform as a band or perform solo.')}</li>
          <li>{t('Lip syncing is not allowed. Use your authentic voice.')}</li>
          <li>{t('Be creative!')}</li>
        </ul>
      </div>
      <h3 className="font-semibold text-xl text-slate-50 mt-4">
        {t('Learn more about the rules for producing and uploading your video entries')}{' '}
        <Link href="/support/terms-of-service">
          <span className="underline font-bold">{t('here.')}</span>
        </Link>
      </h3>
      <div className="flex flex-col gap-5">
        <h3 className="font-semibold text-2xl text-[#FF00FE]">{t('How to submit a video?')}</h3>
        <div className="flex flex-col gap-3">
          <h3 className="font-light text-xl text-slate-50">
            {t(
              "It's simple. Upload your performance video to your YouTube channel. Copy and paste the video link from YouTube into the video upload form here."
            )}
          </h3>
        </div>
      </div>
    </div>
  );
}
