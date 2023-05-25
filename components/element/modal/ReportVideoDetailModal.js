import { useReportVideoMutation } from 'core/services/rtk/EventServices';
import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { setModal } from '../../../core/redux/reducers/modalSlice';
import { setReasonId, setVideoId, setDescription } from 'core/redux/reducers/threedotsSlice';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';

export default function ReportVideoDetailModal() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
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
  const { videoId, reasonId, description } = useSelector((state) => state.threeDots);

  const [report, { data, isSuccess, isError, isLoading }] = useReportVideoMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success(t('Report video success'));
      dispatch(setModal({ name: 'modalReportVideoDescription', value: false }));
      dispatch(setVideoId(null));
      dispatch(setReasonId(null));
      dispatch(setDescription(null));
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      toast.error(t('Report video failed'));
      dispatch(setModal({ name: 'modalReportVideoDescription', value: false }));
      dispatch(setVideoId(null));
      dispatch(setReasonId(null));
      dispatch(setDescription(null));
    }
  }, [isError]);

  return (
    <>
      <div className="">
        <div className="bg-black/20 fixed inset-0 w-full z-50 flex items-center md:justify-center">
          <div className="bg-[#2B1462] text-slate-50 rounded-r-2xl md:rounded-2xl px-8 md:px-8 pt-8 pb-8 flex flex-col animate-l-to-r w-[92%] md:max-w-md">
            <div className="flex justify-end">
              <Image
              src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/close-icon.png`}
              alt="close"
              width={24}
              height={24}
              className="cursor-pointer"
              onClick={() => {
                dispatch(setModal({ name: 'modalReportVideoDescription', value: false }));
                dispatch(setVideoId(null));
                dispatch(setReasonId(null));
                dispatch(setDescription(null));
              }}
              />
              {/* <RiCloseFill
                size={32}
                className="cursor-pointer"
                onClick={() => {
                  dispatch(setModal({ name: 'modalReportVideoDescription', value: false }));
                  dispatch(setVideoId(null));
                  dispatch(setReasonId(null));
                  dispatch(setDescription(null));
                }}
              /> */}
            </div>
            <div className="flex flex-col gap-6">
              <h3 className="text-2xl leading-6 font-bold">{t('Report Video Description')}</h3>
              {/* <span className="text-md font-medium">
                Enter your detail report information
              </span> */}
            </div>
            <div className="my-3">
              <form id="form-des">
                <div className="w-full">
                  <textarea
                    rows={6}
                    placeholder={t("Provide more additional information")}
                    className="border rounded-md focus:outline-none w-full p-3 text-md text-gray-600"
                    tabIndex={-1}
                    value={description}
                    onChange={(e) => dispatch(setDescription(e.target.value))}
                  />
                </div>
              </form>
            </div>
            <div className="flex flex-col my-3 gap-2">
              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="inline-flex justify-center border-2 border-[#FF00FE] hover:bg-[#FF00FE] rounded-md px-4 py-2 text-sm tetx-slate-50 bg-second-accent text-third-accent focus:outline-none font-semibold disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:border-[#FF00FE]"
                  onClick={() => {
                    report({
                      idVideo: videoId,
                      reasonId: reasonId,
                      description: description
                    });
                    // dispatch(setModal({ name: 'modalReportVideoDescription', value: false }));
                    // dispatch(setVideoId(null));
                    // dispatch(setReasonId(null));
                  }}
                  disabled={(description === '') || (description === null) || isLoading}
                >
                  {isLoading ? 'Loading...' : `${t('Report')}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
