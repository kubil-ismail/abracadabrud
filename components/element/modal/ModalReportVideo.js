import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setModal } from '../../../core/redux/reducers/modalSlice';
import ReportVideoDetailModal from './ReportVideoDetailModal';
import { setDescription, setReasonId, setVideoId } from 'core/redux/reducers/threedotsSlice';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';

export default function ModalReportVideo() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { reasonId } = useSelector((state) => state.threeDots);
  const [datas] = useState([
    { id: 1, title: 'Sexual content' },
    { id: 2, title: 'Violent or repulsive content' },
    { id: 3, title: 'Hateful or abusive content' },
    { id: 4, title: 'Harassment or bullying' },
    { id: 5, title: 'Harmful or dangerous content' },
    { id: 6, title: 'Child abuse' },
    { id: 7, title: 'Promotes terorrism' },
    { id: 8, title: 'Spam or misleading' },
    { id: 9, title: 'Infringes my rights' },
    { id: 10, title: 'Captions issue' },
    { id: 11, title: 'Other' }
  ]);
  const { modalReportVideoDescription, modalReportVideo } = useSelector((state) => state.modal);
  return (
    <>
      {modalReportVideoDescription && <ReportVideoDetailModal />}
      {modalReportVideo && <div className="">
        <div className="bg-black/20 fixed inset-0 w-full z-50 flex items-center md:justify-center">
          <div className="bg-[#2B1462] text-slate-50 rounded-r-2xl md:rounded-2xl px-8 md:px-8 pt-8 pb-12 flex flex-col animate-l-to-r w-[92%] md:max-w-md">
            <div className="flex justify-end">
            <Image
            src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/close-icon.png`}
            alt="close"
            width={24}
            height={24}
            className="cursor-pointer"
            onClick={() => {
              dispatch(setModal({ name: 'modalReportVideo', value: false }));
              dispatch(setModal({ name: 'modalReportVideoDescription', value: false }));
              dispatch(setVideoId(null));
              dispatch(setReasonId(null));
              dispatch(setDescription(''));
            }}
            />
              {/* <RiCloseFill
                size={32}
                className="cursor-pointer"
                onClick={() => {
                  dispatch(setModal({ name: 'modalReportVideo', value: false }));
                  dispatch(setModal({ name: 'modalReportVideoDescription', value: false }));
                  dispatch(setVideoId(null));
                  dispatch(setReasonId(null));
                  dispatch(setDescription(''));
                }}
              /> */}
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-2xl leading-6 mb-4 font-bold">{t('Report Video')}</h3>
              {/* <span className="text-xs md:text-sm font-medium">Enter the email address you used when you joined and we’ll send you instruction to reset your password</span> */}
            </div>
            <div className="my-3">
              <form id="form-reason">
                <div className="flex flex-col gap-3">
                  {datas.map((value) => (
                    <div className="flex gap-2 items-center cursor-pointer">
                      <input
                        type="radio"
                        id={value.id}
                        value={value.id}
                        name="reason_id"
                        //   defaultChecked={value.id === reasonId.reason_id}
                        onClick={(e) => dispatch(setReasonId(e.target.id))}
                      //   {...register('reason_id', { required: true })}
                      />
                      <label htmlFor={value.id}>{t(value?.title)}</label>
                    </div>
                  ))}
                </div>
              </form>
            </div>
            <div className="flex flex-col mt-5 mb-3 gap-2 border-t">
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  className="inline-flex text-slate-50 justify-center rounded-md px-4 py-2 text-sm font-semibold focus:outline-none"
                  // onClick={onHide}
                  // style={{ color: style?.secondary_background }}
                  // onClick={() => dispatch(setModal({ name: 'modalReportVideo', value: false }))}
                  onClick={() => {
                    dispatch(setModal({ name: 'modalReportVideo', value: false }));
                    dispatch(setModal({ name: 'modalReportVideoDescription', value: false }));
                    dispatch(setModal({ name: 'modalReportVideoDescription', value: false }));
                    dispatch(setVideoId(null));
                    dispatch(setReasonId(null));
                    dispatch(setDescription(''));
                  }}
                >
                  {t('Cancel')}
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center border-2 border-[#FF00FE] hover:bg-[#FF00FE] rounded-md px-4 py-2 text-sm tetx-slate-50 bg-second-accent text-third-accent focus:outline-none font-semibold disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:border-[#FF00FE]"
                  // onClick={() => onSubmitReason(reasonId)}
                  // style={{ color: style?.secondary_background, background: style?.accent_background }}
                  onClick={() => {
                    dispatch(setModal({ name: 'modalReportVideo', value: false }));
                    dispatch(setModal({ name: 'modalReportVideoDescription', value: true }));
                  }}
                  disabled={reasonId === null}
                >
                 {t('Next')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      }
    </>
  );
}
