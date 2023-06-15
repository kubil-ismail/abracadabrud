import { useTranslation } from 'react-i18next';

export default function TheWinnersAre() {
  const { t } = useTranslation();
  return (
    <div className="px-4 py-20 md:py-32 rounded-[20px] text-slate-50 flex flex-col gap-1 text-center">
      <h3 className="text-3xl md:text-[48px] font-extrabold w-full md:w-[85%] m-auto tracking-[-2.5%] leading-[100%] ">
        {t('And the winners are...')}
      </h3>
    </div>
  );
}
