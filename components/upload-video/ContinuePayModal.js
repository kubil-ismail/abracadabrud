import { RiCloseFill } from 'react-icons/ri';
import { useSelector, useDispatch } from 'react-redux';
import { setModal } from '../../core/redux/reducers/modalSlice';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import {
  eventApi,
  useGetAllEventsQuery,
  useGetStatusPaymentVideoQuery
} from 'core/services/rtk/EventServices';
import {
  setContestId,
  setEventId,
  setVideoUploadFee,
  setEvents,
  setPaymentFor,
  setData
} from 'core/redux/reducers/paymentsSlice';
import { logout } from 'core/redux/reducers/authenticationSlice';
import { useTranslation } from 'react-i18next';
import { setCookie } from 'nookies';
import { deleteCookie } from 'cookies-next';

export default function ContinuePayModal({ onClose }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const router = useRouter();
  const { modalContinuePay } = useSelector((state) => state.modal);
  const { isAuthenticated, token } = useSelector((state) => state.authentication);
  const { data: events, refetch: refetchEvents, isSuccess, isLoading } = useGetAllEventsQuery();

  const { error } = useGetStatusPaymentVideoQuery(
    {
      event_contest_id: events?.data?.data[0]?.current_contest?.id ?? events?.last_event?.event_contest_id
    },
    {
      skip: !isLoading
    }
  );

  useEffect(() => {
    if (modalContinuePay) {
      refetchEvents();
      // reset except getStatusPaymentVideo
      dispatch(
        eventApi.util.invalidateTags([
          { type: 'PaymentVideo', id: events?.data?.data[0]?.current_contest?.id }
        ])
      );
    }
  }, [modalContinuePay]);

  useEffect(() => {
    if (events?.data?.data.length > 0) {
      dispatch(setEventId(events?.data?.data[0]?.id));
      dispatch(setContestId(events?.data?.data[0]?.current_contest?.id));
      dispatch(setVideoUploadFee(events?.data?.data[0]?.video_upload_fee));
      dispatch(setEvents(events?.data?.data[0]));
    }
    if (events?.data?.data.length === 0 && events?.last_event) {
      // dispatch(setEvents(events?.last_event));
      dispatch(setContestId(events?.last_event?.event_contest_id));
      // dispatch(setEventId(events?.last_event?.id));
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error?.status === 401) {
      dispatch(logout());
    }
  }, [error]);

  return (
    <>
      <div
        className={`${modalContinuePay && isAuthenticated && token && events?.data?.data.length > 0
          ? ''
          : 'hidden'
          } flex items-center justify-center`}>
        <div className="bg-black/20 fixed inset-0 w-full z-50 flex items-center md:justify-center">
          <div className="bg-[#2B1462] text-slate-50 rounded-r-2xl md:rounded-2xl px-8 md:px-8 pt-8 pb-12 flex flex-col animate-l-to-r w-[92%] md:max-w-md">
            <div className="flex justify-end">
              <RiCloseFill
                size={32}
                onClick={() => {
                  dispatch(setModal({ name: 'modalContinuePay', value: false }));
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
                <h3 className="text-lg font-semibold text-center">{t('Upload another video!')}</h3>
                <p className="text-center">
                  {t(
                    'The more videos you upload the more votes you will get. Additional video uploads are Rp. 50,000. Upload your next video here.'
                  )}
                </p>
                {isLoading ? (
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="bg-[#23FF2C] text-zinc-900 px-4 py-2 text-sm font-semibold rounded-md"
                    onClick={() => {
                      dispatch(setPaymentFor('video_upload'));
                      dispatch(setData({}));
                      deleteCookie('payment');
                      setCookie('payment', JSON.stringify({ payment_for: 'video_upload' }));
                      router.push('/checkout');
                      dispatch(setModal({ name: 'modalContinuePay', value: false }));
                    }}
                    disabled={isLoading}>
                    {t('Upload another video!')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
