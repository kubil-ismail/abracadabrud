import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function WhatIsFaq() {
  const { t } = useTranslation();
  return (
    <div className="py-7 rounded-2xl text-slate-50 gap-5">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="">
          <img
            src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/faq.png`} 
            alt="faq"
            className="w-full md:h-96 rounded-xl object-cover"
          />
        </div>
        <div className="text-center mt-5 md:mt-0">
          <ul className="list-none font-semibold text-[32px] text-center flex flex-col space-y-[0.6rem] w-full">
            <li className="font-extrabold mb-7">{t('Frequently Asked Questions')}</li>
            <Link href="/faq/#win-awesome">
              <li>{t('What are the prizes?')}</li>
            </Link>
            <Link href="/faq/#how-to-win">
              <li>{t('How to win?')}</li>
            </Link>
            <Link href="/faq/#collect-votes">
              <li>{t('How to collect more points?')}</li>
            </Link>
            <Link href="/faq/#submit-video">
              <li>{t('How to submit a video?')}</li>
            </Link>
            <Link href="/faq/#memberships">
              <li>{t('How to upgrade my membership?')}</li>
            </Link>
          </ul>
        </div>
      </div>
    </div>
  );
}
