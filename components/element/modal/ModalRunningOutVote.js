import Image from 'next/image';
import { useTranslation } from 'react-i18next';
// import { setModal } from '../../core/redux/reducers/modalSlice';

export default function ModalRunningOutVote({ onClose }) {
    const { t } = useTranslation();

  return (
    <>
      <div className="">
        <div className="bg-black/20 fixed inset-0 w-full z-50 flex items-center md:justify-center">
          <div className="bg-[#2B1462] text-slate-50 rounded-r-2xl md:rounded-2xl px-8 md:px-8 pt-8 pb-12 flex flex-col animate-l-to-r w-[92%] md:max-w-md">
            <div className="flex justify-end mb-3">
              <Image
              src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/close-icon.png`}
              alt="close"
              width={24}
              height={24}
              className="cursor-pointer"
              />
              {/* <RiCloseFill
                size={32}
                className="cursor-pointer"
              /> */}
            </div>
            <div className="flex flex-col space-y-6">
                <h3 className="font-bold text-[36px] w-3/4 m-auto block text-center">{t('Oops. You need more points to vote.')}</h3>
                <button type="button" className="bg-[#23FF2C] text-[#0000FF] rounded-[10px] px-3 py-2 w-44 m-auto font-semibold">{t('Collect  points')}</button>
                <button type="button" className="bg-[#23FF2C] text-[#0000FF] rounded-[10px] px-3 py-2 w-44 m-auto font-semibold">{t('Buy points')}</button>
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
}
