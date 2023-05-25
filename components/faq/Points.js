import { useTranslation } from 'react-i18next';

export default function Points() {
  const { t } = useTranslation();
  return (
    <div className="relative bg-[#5100ff] py-4 rounded-[20px] break-words">
      <div className="flex flex-col md:grid md:grid-cols-2 space-y-2 md:max-w-5xl md:m-auto items-center">
        <h3 className="text-2xl font-extrabold text-slate-50 uppercase md:hidden">
          {t('One point = 1 vote')}
        </h3>
        <img src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/HL_card.png`} alt="card" className="w-full md:w-96" />
        <h3 className="text-2xl font-extrabold text-slate-50 uppercase md:hidden text-center">
          {t('The most points win!')}
        </h3>
        <div className="hidden md:block">
          <div className="flex flex-col space-y-4">
            <h3 className="text-2xl md:text-4xl font-extrabold text-slate-50 uppercase">
              {t('One point = 1 vote')}
            </h3>
            <h3 className="text-2xl md:text-4xl font-extrabold text-slate-50 uppercase">
              {t('The most points win!')}
            </h3>
          </div>
        </div>
      </div>
      {/* <div className="px-5 py-7 rounded-2xl bg-[#0000FF] text-slate-50 flex flex-col gap-5 text-center">
        <h3 className="text-2xl font-bold mb-2 text-slate-50 uppercase">One Point = 1 Vote</h3>
        <img src="/assets/images/win-prize-htp.png" alt="" className="w-full" />
        <h3 className="text-2xl font-bold mb-2 text-slate-50 uppercase">The most points win !</h3>
        </div> */}
    </div>
  );
}
