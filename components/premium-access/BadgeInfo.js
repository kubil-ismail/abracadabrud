import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function BadgeInfo({ dataActive, dataStatus, isMembership }) {
  const [isActive, setIsActive] = useState(isMembership);
  const { t } = useTranslation();

  return (
    <div className="container w-full h-full">
      <div className="flex flex-col items-center gap-5">
        {isActive ? (
          <div className="flex flex-col space-y-7">
            <div className="flex flex-col space-y-4">
            <img
              src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/verified.png`}
              alt="user-avatar"
              className="w-28 md:w-32 m-auto"
            />
            <h3 className="text-2xl font-extrabold text-[#FF00FE]">{t('Premium Access')}</h3>
            </div>
            <p
                className="text-center text-slate-50 w-full md:w-[60%] md:mx-auto"
                style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.2)' }}>
                  {t(
                    'Premium members get exclusive access to photos and videos backstage as performers rehearse and perform at the main event.'
                  )}
                </p>
          </div>
        ) : (
          <div
            className="fixed z-20 p-2 mb-12"
            style={{ height: '100%', display: 'flex', alignItems: 'flex-start' }}>
            <div>
              <img
                src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/verified.png`}
                alt="user-avatar"
                className="w-28 md:w-36 m-auto"
              />
              <h3
                className="text-2xl font-extrabold text-center text-[#FF00FE] mt-[30px]"
                style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.2)' }}>
                {t('Join us backstage at wePOP!')}
              </h3>

              <br />
              <div className="flex flex-col space-y-3 md:space-y-4">
                <p
                  className="text-center text-[#23FF2C] w-full md:w-[60%] md:mx-auto"
                  style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.2)' }}>
                  {t(
                    'Premium members get exclusive access to photos and videos backstage as performers rehearse and perform at the main event.'
                  )}
                </p>
                <p
                  className="text-center text-[#23FF2C] w-full md:w-[60%] md:mx-auto"
                  style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.2)' }}>
                  {t(
                    'Increase your chances to win amazing prizes every week by upgrading your account to premium!'
                  )}
                </p>
                {/* <p className="text-center text-[#23FF2C] w-full md:w-[60%] md:mx-auto">
                {t('Make sure your premium access is active the week of the concert to gain backstage access.')}
              </p> */}
              </div>

              <br />

              <div className="flex justify-center">
                <Link href="/faq#memberships">
                  <button className="bg-[#FF00FE] text-slate-50 px-3 py-2 rounded-lg">
                    {t('Upgrade Now!')}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
