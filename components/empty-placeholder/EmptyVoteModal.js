import { setModal } from 'core/redux/reducers/modalSlice';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { RiCloseFill } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';

export default function EmptyVoteModal({ onClose }) {
  const { t } = useTranslation()
  const dispatch = useDispatch();
  const { modalEmptyVote } = useSelector((state) => state.modal);
  return (
    <>
      {modalEmptyVote && (
        <div className="flex items-center justify-center">
          <div className="bg-black/20 fixed inset-0 w-full z-50 flex items-center md:justify-center">
            <div className="bg-[#2B1462] text-slate-50 rounded-r-2xl md:rounded-2xl px-8 md:px-8 py-12 flex flex-col animate-l-to-r w-[92%] md:max-w-md">
              <div className="flex justify-end mb-5">
                <RiCloseFill size={32} onClick={
                  () => {
                    dispatch(setModal({ name: 'modalEmptyVote', value: false }));
                  }
                } className="cursor-pointer" />
              </div>
              <div className="flex flex-col space-y-5 items-center">
                <h3 className="text-4xl font-bold text-center w-3/4">
                  {t('Oops. You need more points to vote.')}
                </h3>
                <Link href="/faq#ways-get-point">
                  <button
                    type="button"
                    onClick={() => {
                      dispatch(setModal({ name: 'modalEmptyVote', value: false }));
                    }}
                    className="bg-[#23FF2C] text-[#0000FF] px-5 py-3 text-sm font-semibold rounded-md mt-4"
                  >
                    {t('Collect points')}
                  </button>
                </Link>
                {/* todo: will work after defining a new payment feature */}
                {/* <Link href="/checkout"> */}
                {/* <button
                  type="button"
                  className="bg-[#23FF2C] text-[#0000FF] px-5 py-3 text-sm font-semibold rounded-md mt-2"
                >
                  {t('Buy Points')}
                </button> */}
                {/* </Link> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
