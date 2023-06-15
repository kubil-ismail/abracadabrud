import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function BuyTicketHere() {
  const { t } = useTranslation();
  return (
    <div className="px-4 py-14 rounded-[16px] bg-[#282828] text-slate-50 flex items-center justify-center text-center break-words h-[360px] md:h-[440px] relative overflow-hidden">
        <div className="absolute -top-6 md:-top-20 -left-8 w-24 md:w-56 h-24 md:h-56 rounded-full bg-[#23FF2C] blur-[70px] md:blur-[130px]"/>
        <div className="absolute -bottom-6 md:-bottom-20 -right-8 w-24 md:w-56 h-24 md:h-56 rounded-full bg-[#23FF2C] blur-[70px] md:blur-[130px]"/>
        <div className="flex flex-col space-y-7">
        <span className="text-3xl md:text-4xl w-full md:w-3/4 text-center m-auto font-bold drop-shadow-[0px_4px_20px_rgba(255,_255,_255,_0.44)]">
            {t('Buy Ticket wePOP: Come Together Here')}
        </span>
        <Link href="https://www.loket.com/" legacyBehavior>
          <a target="_blank">
            <button type="button" className="text-sm md:text-base m-auto px-8 py-3 text-[#21055C] bg-[#23FF2C] hover:bg-[#2AC830] hover:text-slate-50 capitalize rounded-md font-semibold shadow-[0px_4px_20px_rgba(255,_255,_255,_0.44)] transition-all ease-in-out">{t('Buy Now')}</button>
          </a>
        </Link>
        </div>
    </div>
  );
}
