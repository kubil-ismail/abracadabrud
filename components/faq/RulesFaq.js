import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function RulesFaq() {
  const { t } = useTranslation();
  return (
    <div
      className="px-4 md:px-8 py-7 md:py-24 rounded-[20px] bg-[#FF00FE]"
    >
      <div className="flex flex-col space-y-2">
      <h3 className="text-[32px] font-extrabold mb-2 text-[#23FF2C]">{t('Video Rules')}</h3>
      <div className="px-5">
        <ul className="list-decimal font-normal text-xl flex flex-col space-y-[0.813rem]">
          <li>
            {t('Create a music video in which you sing your own original song or a song made famous by one of the event artists.')}
          </li>
          <li>{t('You can perform as a band or perform solo.')}</li>
          <li>{t('Lip syncing is not allowed. Use your authentic voice.')}</li>
          <li>{t('Be creative!')}</li>
        </ul>
      </div>
      <h3 className="font-semibold text-xl text-slate-50 mt-4">
        {t('Learn more about the rules for producing and uploading your video entries')}{' '}
        <Link href="/support/terms-of-service">
          <span className="underline">{t('here.')}</span>
        </Link>
      </h3>
      </div>
    </div>
  );
}
