import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function CompetitionDates() {
  const { t } = useTranslation();
  return (
    <div className="px-4 py-14 rounded-[20px] bg-[#FF00FE] text-[#0000FF] flex flex-col text-center break-words">
      <img src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/wepop-come-together.png`} alt="wepop-come-together" className="w-96 m-auto" />
      {/* <h3 className="text-[64px] font-extrabold m-0">Come Together</h3> */}
      {/* <h5 className="text-[32px] font-semibold m-0">{t('Competition Dates')}</h5> */}
      <h5 className="text-[32px] font-semibold m-0 w-full md:w-[40%] md:m-auto">{t('Buy Ticket wePOP: Come Together Here')}</h5>
      <Link href="https://www.loket.com/" legacyBehavior>
          <a target="_blank">
            <button type="button" className="text-sm md:text-base m-auto px-8 py-3 text-[#21055C] bg-[#23FF2C] hover:bg-[#2AC830] hover:text-slate-50 capitalize rounded-md font-semibold shadow-[0px_4px_20px_rgba(255,_255,_255,_0.44)] transition-all ease-in-out mt-4">{t('Buy Now')}</button>
          </a>
        </Link>
      {/* <span className="text-xl font-normal">{t('3 June – 21 July 2023')}</span> */}
    </div>
  );
}
