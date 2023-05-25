import { useTranslation } from 'react-i18next';

export default function AmazingPrizes() {
  const { t } = useTranslation();
  return (
    <div className="p-4 rounded-2xl bg-[rgb(35,255,44)] text-[#FF00FE] flex flex-col gap-1 text-center">
      <h3 className="text-2xl font-bold mb-3">{t('Amazing Prizes')}</h3>
      <span className="text-lg font-semibold">{t('Concert Tickets')}</span>
      <span className="text-lg font-semibold">{t('Meet & Greet')}</span>
      <span className="text-lg font-semibold">{t('Preform the opening act')}</span>
      <span className="text-lg font-semibold">{t('Travel and accommodation ')}</span>
    </div>
  );
}
