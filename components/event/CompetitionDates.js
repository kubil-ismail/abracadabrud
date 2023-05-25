import Head from 'next/head';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

export default function CompetitionDates() {
  const { t } = useTranslation();
  return (
    <div className="px-4 py-14 rounded-[20px] bg-[#FF00FE] text-[#0000FF] flex flex-col text-center">
      <img src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/wepop-come-together.png`} alt="wepop-come-together" className="w-96 m-auto" />
      {/* <h3 className="text-[64px] font-extrabold m-0">Come Together</h3> */}
      <h5 className="text-[32px] font-semibold m-0">{t('Competition Dates')}</h5>
      <span className="text-xl font-normal">{t('3 June – 21 July 2023')}</span>
    </div>
  );
}
