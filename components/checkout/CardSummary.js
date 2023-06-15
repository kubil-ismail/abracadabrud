import { deleteCookie, setCookie } from 'cookies-next';
import { setData } from 'core/redux/reducers/paymentsSlice';
import SSServices from 'core/services/ServerSide/ssServices';
import Paramcrypt from 'lib/Paramcrypt';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

export default function CardSummary({ stillLoading, paymentMethods }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation();
  const [fee, setFee] = useState(0);
  const {
    payment_for,
    paymentMethodsId,
    event_id,
    event_contest_id,
    video_upload_fee,
    membership_fee,
    points_fee,
    data,
    isUsingCC,
    tokenCC,
    membership_id,
    isQris
  } = useSelector((state) => state.payments);
  const [isLoading, setIsLoading] = useState(false);
  const selector = useSelector((state) => state.authentication);

  const _checkoutMembership = (payload) => {
    setIsLoading(true);
    SSServices.checkoutMembership({ datas: payload, token: selector?.token, client: true })
      .then((result) => {
        if (result?.message === "You already have a pending payment") {
          toast.error(t('You already have a pending payment'));
          router.replace(`/my-account?tab=membership#transaction`);
          return;
        }
        deleteCookie('payment');
        setCookie(
          'payment',
          JSON.stringify({
            ...{
              id: result?.data?.id,
              user_contest_membership_id: result?.data?.user_contest_membership_id
            },
            ...{ payment_for }
          })
        );
        dispatch(setData(result?.data));
        router.replace(`/checkout/order-summary/${Paramcrypt.encode(result?.data?.id)}`);
      })
      .finally(() => setIsLoading(false));
  };

  const _checkoutVideo = (payload) => {
    setIsLoading(true);
    SSServices.checkoutVideo({ datas: payload, token: selector?.token, client: true })
      .then((result) => {
        if (result?.message === "You already have a pending payment") {
          toast.error(t('You already have a pending payment'));
          router.replace(`/my-account?tab=video#transaction`);
          return;
        }
        deleteCookie('payment');
        setCookie(
          'payment',
          JSON.stringify({
            ...{ video_id: result?.data?.video_id, id: result?.data?.id },
            ...{ payment_for }
          })
        );
        dispatch(setData(result?.data));
        router.replace(`/checkout/order-summary/${Paramcrypt.encode(result?.data?.id)}`);
      })
      .finally(() => setIsLoading(false));
  };

  const _checkoutPoints = (payload) => {
    setIsLoading(true);
    SSServices.checkoutPoints({ datas: payload, token: selector?.token, client: true })
      .then((result) => {
        if (result?.message === "You already have a pending payment") {
          toast.error(t('You already have a pending payment'));
          router.replace(`/my-account?tab=points#transaction`);
          return;
        }
        deleteCookie('payment');
        setCookie(
          'payment',
          JSON.stringify({
            ...{ id: result?.data?.id },
            ...{ payment_for }
          })
        );
        dispatch(setData(result?.data));
        router.replace(`/checkout/order-summary/${Paramcrypt.encode(result?.data?.id)}`);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (payment_for === 'membership' || payment_for === 'membership_detail') {
      setFee(membership_fee);
    } else if (payment_for === 'video_upload' || payment_for === 'video_upload_detail') {
      setFee(video_upload_fee);
    } else if (payment_for === 'points') {
      setFee(points_fee);
    }
  }, [payment_for, video_upload_fee, membership_fee, points_fee]);

  const rupiahConvert = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(number);
  }

  // random token
  const token_id = Math.random().toString(36).substr(2, 9);

  return (
    <div className="flex flex-col space-y-5 px-5 p-8 rounded-lg bg-[#2B2B2B]">
      <div className="flex flex-col space-y-7">
        <h3 className="text-lg font-bold mb-4">{t('Order Summary')}</h3>
        <div className="flex justify-between items-center">
          <span className="text-sm">{t('Payment Method')}</span>
          <span className="text-sm font-bold">
            {paymentMethodsId
              ? isQris
                ? 'QRIS'
                : isUsingCC
                  ? 'Credit Card'
                  : paymentMethods?.find((item) => item.id === paymentMethodsId)?.payment_name
              : '-'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-reguler">
            {(payment_for === 'membership') ? `${t('Upgrade Membership Fee')}` :
              (payment_for === 'video_upload') ? `${t('Video Upload Fee')}` :
                (payment_for === 'points') ? `${t('Extra Points Fee')}` : '-'
            }
          </span>
          <span className="text-sm font-semibold">{rupiahConvert(fee)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold">Total</span>
          <span className="text-sm font-bold">{rupiahConvert(fee)}</span>
        </div>
        <div className="mt-5">
          {isLoading || !paymentMethodsId ? (
            <button
              type="button"
              disabled
              className="px-4 py-3 w-full bg-[#383636] text-slate-50/50 border border-zinc-600 text-sm rounded-md">
              {isLoading && (
                <svg
                  aria-hidden="true"
                  className="inline w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              )}

              {isLoading ? t('Loading...') : t('You need to select a payment method')}
            </button>
          ) : (
            <button
              type="button"
              className="px-8 py-2 w-full bg-[#FF00FE] text-[#0000FF] hover:bg-[#6CFF00] transition-all ease-linear hover:text-slate-50 rounded-md text-sm font-semibold flex items-center justify-center"
              onClick={() => {
                if (payment_for === 'membership' || payment_for === 'membership_detail') {
                  _checkoutMembership({
                    payment_method_id: paymentMethodsId,
                    event_contest_id: event_contest_id,
                    membership_id: membership_id,
                    data: {
                      token_id
                    }
                  });
                } else if (payment_for === 'video_upload' || payment_for === 'video_upload_detail') {
                  _checkoutVideo({
                    payment_method_id: paymentMethodsId,
                    event_contest_id: event_contest_id,
                    data: {
                      token_id
                    }
                  });
                } else if (payment_for === 'points') {
                  _checkoutPoints({
                    payment_method_id: paymentMethodsId,
                    event_contest_id: event_contest_id,
                    // TODO: remove amount: "any" when backend ready
                    amount: "any",
                    data: {
                      token_id
                    }
                  });
                }
              }}
              disabled={isLoading || !paymentMethodsId}>
              <div className="flex items-center space-x-2">
                <Image
                  src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/cart.png`}
                  alt="chevron"
                  width={24}
                  height={24}
                />

                <span className="text-slate-50">
                  {isLoading ? 'Loading...' : `${t('Pay Now')}`}
                </span>
              </div>
            </button>
          )}
        </div>
      </div>
    </div >
  );
}
