import { useTranslation } from 'react-i18next';
import { RiCloseFill } from 'react-icons/ri';

export default function ContinuePayModal({ onClose }) {
  const { t } = useTranslation();
  return (
    <>
      <div className={`flex items-center justify-center`}>
        <div className="bg-black/20 fixed inset-0 w-full z-50 flex items-center md:justify-center">
          <div className="bg-[#2B1462] text-slate-50 rounded-r-2xl md:rounded-2xl px-8 md:px-8 pt-8 pb-12 flex flex-col animate-l-to-r w-[92%] md:max-w-md">
            <div className="flex justify-end">
              <RiCloseFill
                size={32}
                onClick={() => {
                  onClose();
                }}
                className="cursor-pointer"
              />
            </div>
            <div className="flex flex-col gap-5">
              <div className="">
                <img
                  src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/warnings.png`}
                  alt="warning"
                  className="w-40 m-auto"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-col gap-5 items-center">
                <h3 className="text-lg font-semibold text-center">{t('The current event has ended')}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
