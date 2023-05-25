import { Dialog } from '@headlessui/react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setPaymentFor, setData } from 'core/redux/reducers/paymentsSlice';
import Paramcrypt from 'lib/Paramcrypt';
import moment from 'moment';
import {
  useCancelMembershipPaymentMutation,
  useCancelPointsPaymentMutation,
  useCancelVideoPaymentMutation
} from 'core/services/rtk/EventServices';
import { pointApi } from 'core/services/rtk/MeServices';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { setCookie } from 'cookies-next';

export default function ModalTransaction({ isOpen, closeModal, data }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isCancelled, setIsCancelled] = useState(false);
  const router = useRouter();

  const [
    cancelMembershipPayment,
    {
      isLoading: isLoadingCancelPaymentMembership,
      isSuccess: isSuccessCancelPaymentMembership,
      isError: isErrorCancelPaymentMembership,
      error: errorCancelPaymentMembership
    }
  ] = useCancelMembershipPaymentMutation();

  const [
    cancelVideoPayment,
    {
      isLoading: isLoadingCancelPaymentVideo,
      isSuccess: isSuccessCancelPaymentVideo,
      isError: isErrorCancelPaymentVideo,
      error: errorCancelPaymentVideo
    }
  ] = useCancelVideoPaymentMutation();

  const [
    cancelPointsPayment,
    {
      isLoading: isLoadingCancelPaymentPoints,
      isSuccess: isSuccessCancelPaymentPoints,
      isError: isErrorCancelPaymentPoints,
      error: errorCancelPaymentPoints
    }
  ] = useCancelPointsPaymentMutation();

  const cancelPayment = () => {
    const confirm = window.confirm('Are you sure to cancel this payment?');
    if (confirm) {
      if (data?.user_contest_membership_id) {
        cancelMembershipPayment({
          membership_id: data?.id
        });
      }
      if (data?.video_id) {
        cancelVideoPayment({
          video_contest_id: data?.id
        });
      }
      if (data?.user_contest_buy_point_id) {
        cancelPointsPayment({
          buy_points_payment_id: data?.id
        });
      }
    }
  };

  useEffect(() => {
    if (isSuccessCancelPaymentMembership || isSuccessCancelPaymentVideo || isSuccessCancelPaymentPoints) {
      setIsCancelled(true);
    }
  }, [isSuccessCancelPaymentMembership, isSuccessCancelPaymentVideo, isSuccessCancelPaymentPoints]);

  return (
    <>
      <Dialog as="div" className="relative z-10" open={isOpen} onClose={closeModal}>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#2B1462] text-slate-50 p-8 mx-3 md:mx-0 text-left align-middle shadow-xl transition-all">
              <div className="flex flex-col gap-4">
                <h3 className="text-2xl leading-6 mb-5 font-bold">{t('Detail Transaction')}</h3>
              </div>
              <div className="flex flex-col gap-5">
                <div className="flex justify-between gap-3">
                  <span className="text-sm font-reguler">{t('Invoice ID')}</span>
                  <span className="text-sm font-bold underline">{data?.order_id}</span>
                </div>
                <div className="flex justify-between gap-3 pb-2 border-b border-white">
                  <span className="text-sm font-reguler">{t('Status')}</span>
                  <span className="text-sm font-bold">
                    {data?.status === 1 && !isCancelled
                      ? 'Pending'
                      : data?.status === 2
                        ? 'Paid'
                        : data?.status === 3
                          ? 'Expired'
                          : data?.status === 4 || isCancelled
                            ? 'Canceled'
                            : data?.status === 5
                              ? 'Refund'
                              : '-'}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-reguler">{t('Price')}</span>
                  <input
                    type="text"
                    className="px-3 py-2 bg-white text-zinc-800 rounded-md text-sm"
                    value={data?.amount}
                    disabled
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-reguler">{t('Date & Time')}</span>
                  <input
                    type="text"
                    className="px-3 py-2 bg-white text-zinc-800 rounded-md text-sm"
                    disabled
                    value={moment(data?.created_at).calendar()}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-reguler">{t('Item')}</span>
                  <input
                    type="text"
                    className="px-3 py-2 bg-white text-zinc-800 rounded-md text-sm"
                    value={
                      data?.user_contest_membership_id
                        ? 'Membership'
                        : data?.video_id
                          ? 'Video Upload'
                          : data?.user_contest_buy_point_id
                            ? 'Buy Points'
                            : '-'
                    }
                    disabled
                  />
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-sm font-reguler">{t('Payment Method')}</span>
                  <span className="text-sm font-bold">{data?.payment_name === "Gopay" ? "Gopay / QRIS" : data?.payment_name}</span>
                </div>
                {data?.status === 1 && !isCancelled && (
                  <div className="flex items-center justify-end gap-3 mt-3">
                    <button
                      type="button"
                      className="px-3 py-2 border border-[#FF00FE] text-[#FF00FE] rounded-md text-sm font-semibold"
                      onClick={cancelPayment}
                      disabled={isLoadingCancelPaymentMembership || isLoadingCancelPaymentVideo || isLoadingCancelPaymentPoints}>
                      {isLoadingCancelPaymentMembership || isLoadingCancelPaymentVideo || isLoadingCancelPaymentPoints ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                        </div>
                      ) : (
                        `${t('Cancel Payment')}`
                      )}
                    </button>
                    <button
                      type="button"
                      className="px-8 py-2 bg-[#FF00FE] text-[#0000FF] rounded-md text-sm font-semibold"
                      onClick={() => {
                        if (data?.user_contest_membership_id) {
                          setCookie(
                            'payment',
                            JSON.stringify({
                              ...{
                                id: data?.id,
                                user_contest_membership_id: data?.user_contest_membership_id
                              },
                              ...{ payment_for: 'membership' }
                            })
                          );
                          dispatch(setPaymentFor('membership_detail'));
                          router.replace(`/checkout/order-summary/${Paramcrypt.encode(data?.id)}`);
                        }
                        if (data?.video_id) {
                          setCookie(
                            'payment',
                            JSON.stringify({
                              ...{
                                video_id: data?.video_id,
                                id: data?.id
                              },
                              ...{ payment_for: 'video_upload' }
                            })
                          );
                          dispatch(setPaymentFor('video_upload_detail'));
                          router.replace(`/checkout/order-summary/${Paramcrypt.encode(data?.id)}`);
                        }
                        if (data?.user_contest_buy_point_id) {
                          setCookie(
                            'payment',
                            JSON.stringify({
                              ...{
                                user_contest_buy_point_id: data?.user_contest_buy_point_id,
                                id: data?.id
                              },
                              ...{ payment_for: 'points' }
                            })
                          );
                          dispatch(setPaymentFor('points'));
                          router.replace(`/checkout/order-summary/${Paramcrypt.encode(data?.id)}`);
                        }
                        dispatch(setData(data));
                      }}
                      disabled={isLoadingCancelPaymentMembership || isLoadingCancelPaymentVideo || isLoadingCancelPaymentPoints}>
                      {t('Pay')}
                    </button>
                  </div>
                )}
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
