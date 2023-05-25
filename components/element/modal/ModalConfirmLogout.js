import { setModal } from 'core/redux/reducers/modalSlice';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
// import { setModal } from '../../core/redux/reducers/modalSlice';

export default function ModalConfirmLogout({ onHide, logout }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();


  return (
    <>
      <div className="">
        <div className="bg-black/20 fixed inset-0 w-full z-50 flex items-center md:justify-center">
          <div className="bg-[#2B1462] text-slate-50 rounded-r-2xl md:rounded-2xl px-8 md:px-8 pt-8 pb-12 flex flex-col animate-l-to-r w-[92%] md:max-w-md">
            <div className="flex justify-end mb-3">
            <Image
            src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/close-icon.png`}
            alt="close"
            width={20}
            height={20}
            className="cursor-pointer"
            onClick={() => dispatch(setModal({ name: 'modalLogout', value: false }))}
            />
              {/* <RiCloseFill
                size={32}
                className="cursor-pointer"
                onClick={() => dispatch(setModal({ name: 'modalLogout', value: false }))}
              /> */}
            </div>
            <div className="flex flex-col space-y-12 max-w-sm m-auto">
                <h3 className="font-bold text-2xl w-full md:w-3/4 m-auto block text-center">{t("You'll be logged out from abracadabra. Are you sure?")}</h3>
                <div className="flex items-center space-x-5 w-full">
                    <button type="button" onClick={() => dispatch(setModal({ name: 'modalLogout', value: false }))} className="cursor-pointer bg-slate-300/90 text-zinc-800 rounded-[10px] px-3 py-2 w-1/2 m-auto font-semibold">{t('Cancel')}</button>
                    <button type="button" onClick={logout} className="cursor-pointer bg-[#23FF2C] text-[#0000FF] rounded-[10px] px-3 py-2 w-1/2 m-auto font-semibold">{t('Logout')}</button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
