import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { guidePayments } from 'store/master.data';
import PaymentsGuide from './PaymentsGuide';
import { useTranslation } from 'react-i18next';
import { isAndroid } from 'react-device-detect';
import SSServices from 'core/services/ServerSide/ssServices';
import moment from 'moment';
import Image from 'next/image';
import { getCookie } from 'cookies-next';

const VideoPayment = (props) => {
  const router = useRouter();
  const { data, payment_for, isQris } = useSelector((state) => state.payments);
  const { token, user } = useSelector((state) => state.authentication);
  const [timer_2, setTimer_2] = useState('Loading...');

  const [isIos, setIsIos] = useState(false);
  const [paymentGuide, setPaymentGuide] = useState([]);
  const { t } = useTranslation();
  const paymentVideoId = props?.data?.paymentDetail;

  useEffect(() => {
    const ios = () => {
      if (typeof window === `undefined` || typeof navigator === `undefined`) return false;

      return (
        (/iPhone|iPad|iPod/i.test(
          navigator.userAgent ||
          navigator.vendor ||
          (window.opera && opera.toString() === `[object Opera]`)
        ) ||
          isAndroid) &&
        navigator?.platform !== 'Win32' &&
        navigator?.platform !== 'Linux x86_64' &&
        navigator?.platform !== 'MacIntel'
      );
    };

    if (ios()) {
      setIsIos(true);
    }
  }, []);

  const countDownMembership = (data) => {
    let x;
    if (payment_for === 'video_upload' || payment_for === 'video_upload_detail') {
      if (data) {
        const countDownDate = moment(data?.data?.transaction?.expired_at).get();
        x = setInterval(() => {
          const now = new Date().getTime();
          const distance = countDownDate - now;

          if (distance < 0 || !distance) {
            setTimer_2('EXPIRED');
            return () => {
              clearInterval(x);
            };
          } else {
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setTimer_2(`${hours}:${minutes}:${seconds}`);
          }
        }, 1000);

        return () => {
          clearInterval(x);
        };
      }
    } else {
      clearInterval(x);
    }
  };

  useEffect(() => {
    setTimer_2('Loading...');
    if (paymentVideoId) countDownMembership(paymentVideoId);
  }, []);

  useEffect(() => {
    const guide = guidePayments.filter((item) =>
      isQris
        ? item.payment_code === paymentVideoId?.data?.payment_method?.payment_code && item.isQris
        : item.payment_code === paymentVideoId?.data?.payment_method?.payment_code && !item.isQris
    );
    setPaymentGuide(guide);
  }, [paymentVideoId]);

  useEffect(() => {
    if (payment_for === 'video_upload' || payment_for === 'video_upload_detail') {
      let interval = setInterval(() => {
        SSServices.getPaymentVideoId({ id: data?.id, token, client: true }).then((result) => {
          if (result?.data?.transaction?.status === 2) {
            clearInterval(interval);
            toast.success(t('Payment success, redirect to profile...'));
            router.replace('/my-account?tab=video#transaction');
          } else if (result?.data?.transaction?.status === 3) {
            clearInterval(interval);
            toast.error(t('Payment expired, redirect to profile...'));
            router.replace(`/my-account?tab=video#transaction`);
          } else if (result?.data?.transaction?.status === 4) {
            clearInterval(interval);
            toast.error(t('Payment canceled, redirect to profile...'));
            router.replace(`/my-account?tab=video#transaction`);
          }
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [props]);

  return (
    <>
      <h3 className="text-2xl font-bold text-center">
        {t('Order Video Upload Successfully Created')}
      </h3>
      <div className="">
        <Image
          src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/waiting-payment.png`}
          alt="waiting-payment"
          width={240}
          height={240}
          className="m-auto"
        />
      </div>
      <div className="flex flex-col space-y-5 text-center">
        <h3 className="text-lg font-bold">{timer_2}</h3>
        <span className="text-xs font-light">
          {t('Please complete the payment with the information below before')}{' '}
          {new Date(paymentVideoId?.data?.transaction?.expired_at).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
          })}
        </span>
      </div>

      {/* Mobile phone olny alert */}
      {(data?.payment_name ?? data?.payment_method?.payment_name) === 'ShopeePay' && !isIos && (
        <div
          className="flex p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 max-w-2xl md:m-auto"
          role="alert">
          <svg
            aria-hidden="true"
            className="flex-shrink-0 inline w-5 h-5 mr-3"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg">
            <path
              llRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"></path>
          </svg>
          <span className="sr-only">Info</span>
          <div>{t('Please complete this payment on your mobile phone')}</div>
        </div>
      )}

      {/* <div className="flex flex-col gap-5">Order id: {data?.order_id}</div>
      <div className="flex flex-col gap-5">
        Payment Method: {data?.payment_name ?? data?.payment_method?.payment_name}
      </div> */}
      {(data?.payment_type === 'ewallet' || data?.payment_method?.payment_type === 'ewallet') &&
        data?.how_to_pay?.find((res) => res?.name === 'generate-qr-code') && (
          <div className="flex flex-col space-y-5 max-w-2xl md:mx-auto">
            <p className="text-center">{t('How To Pay:')}</p>
            <div className="flex flex-col space-y-5">
              <div className="flex flex-col space-y-5 mt-3">
                <img
                  src={paymentVideoId?.data?.transaction?.how_to_pay[0]?.url}
                  alt=""
                  className="w-[250px] md:w-[320px] m-auto"
                />
              </div>
            </div>
            <p className="text-center">{t('Or')}</p>
          </div>
        )}
      {(data?.payment_type === 'outlet' || data?.payment_method?.payment_type === 'outlet') && (
        // <div className="flex flex-col gap-5">
        //   Code/Account Number: {paymentVideoId?.data?.transaction?.how_to_pay[0]?.payment_code}
        // </div>
        <div className="bg-zinc-800 px-4 py-3 rounded-md w-full max-w-2xl md:m-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              {data?.payment_method?.payment_image?.image && (
                <img src={data?.payment_method?.payment_image?.image} alt="logo" className="w-12" />
              )}
              <span className="text-xs md:text-sm flex flex-col gap-5">
                {data?.payment_name ?? data?.payment_method?.payment_name}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-xs md:text-sm flex flex-col space-y-5">
                {paymentVideoId?.data?.transaction?.how_to_pay[0]?.payment_code}
              </span>
              <Image
                src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/copy-icon.png`}
                alt="copy"
                width={18}
                height={18}
                className="cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(
                    paymentVideoId?.data?.transaction?.how_to_pay[0]?.payment_code
                  );
                  toast.success(t('Success copy code to clipboard'));
                }}
              />
              {/* <MdContentCopy
                size={16}
                className="cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(
                    paymentVideoId?.data?.transaction?.how_to_pay[0]?.payment_code
                  );
                  toast.success(t('Success copy code to clipboard'));
                }}
              /> */}
            </div>
          </div>
        </div>
      )}

      {/* check if not mandiri account */}
      {(data?.payment_type ?? data?.payment_method?.payment_type) === 'virtual_account' &&
        (data?.payment_code ?? data?.payment_method?.payment_code) !== 'va_mandiri' && (
          <div className="bg-zinc-800 px-4 py-3 rounded-md w-full max-w-2xl md:m-auto">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                {data?.payment_method?.payment_image?.image && (
                  <img
                    src={data?.payment_method?.payment_image?.image}
                    alt="logo"
                    className="w-12"
                  />
                )}
                <span className="text-xs md:text-sm flex flex-col gap-5">
                  {data?.payment_name ?? data?.payment_method?.payment_name}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-xs md:text-sm flex flex-col gap-5">
                  {data?.how_to_pay[0]?.va_number}
                </span>
                <Image
                  src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/copy-icon.png`}
                  alt="copy"
                  width={18}
                  height={18}
                  className="cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(data?.how_to_pay[0]?.va_number);
                    toast.success(t('Success copy virtual account code to clipboard'));
                  }}
                />
                {/* <MdContentCopy
                  size={16}
                  className="cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(data?.how_to_pay[0]?.va_number);
                    toast.success(t('Success copy virtual account code to clipboard'));
                  }}
                /> */}
              </div>
            </div>
          </div>
          // <div className="flex items-center gap-2">
          //   Virtual Account Number: {data?.how_to_pay[0]?.va_number}{' '}
          //   <MdContentCopy
          //     style={{ cursor: 'pointer' }}
          //     onClick={() => {
          //       navigator.clipboard.writeText(data?.how_to_pay[0]?.va_number);

          //       toast.success('Success copy virtual account to clipboard');
          //     }}
          //   />
          // </div>
        )}

      {(data?.payment_type ?? data?.payment_method?.payment_type) === 'virtual_account' &&
        (data?.payment_code ?? data?.payment_method?.payment_code) === 'va_mandiri' && (
          // <>
          //   <div className="flex items-center gap-2">
          //     Billing Code : {data?.how_to_pay[0]?.biller_code}{' '}
          //     <MdContentCopy
          //       style={{ cursor: 'pointer' }}
          //       onClick={() => {
          //         navigator.clipboard.writeText(data?.how_to_pay[0]?.biller_code);

          //         toast.success('Success copy Billing Code to clipboard');
          //       }}
          //     />
          //   </div>
          //   <div className="flex items-center gap-2">
          //     Billing Number : {data?.how_to_pay[0]?.bill_key}{' '}
          //     <MdContentCopy
          //       style={{ cursor: 'pointer' }}
          //       onClick={() => {
          //         navigator.clipboard.writeText(data?.how_to_pay[0]?.bill_key);

          //         toast.success('Success copy Biiling Number to clipboard');
          //       }}
          //     />
          //   </div>
          // </>
          <div className="bg-zinc-800 px-4 py-3 rounded-md w-full max-w-2xl md:m-auto">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                {data?.payment_method?.payment_image?.image && (
                  <img
                    src={data?.payment_method?.payment_image?.image}
                    alt="logo"
                    className="w-12"
                  />
                )}
                <span className="text-xs md:text-sm flex flex-col gap-5">
                  {data?.payment_name ?? data?.payment_method?.payment_name}
                </span>
              </div>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-4 justify-end">
                  <div className="flex space-x-1 items-baseline">
                    <span className="text-[10px] text-zinc-300 font-light">( Bill Key )</span>
                    <span className="text-xs md:text-sm flex flex-col gap-5">
                      {data?.how_to_pay[0]?.biller_code}
                    </span>
                  </div>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/copy-icon.png`}
                    alt="copy"
                    width={18}
                    height={18}
                    className="cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText(data?.how_to_pay[0]?.biller_code);
                      toast.success(t('Success copy Billing Code to clipboard'));
                    }}
                  />
                  {/* <MdContentCopy
                    size={16}
                    className="cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText(data?.how_to_pay[0]?.biller_code);
                      toast.success(t('Success copy Billing Code to clipboard'));
                    }}
                  /> */}
                </div>
                <div className="flex items-center space-x-4 justify-end">
                  <span className="text-xs md:text-sm flex flex-col gap-5">
                    {data?.how_to_pay[0]?.bill_key}
                  </span>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/copy-icon.png`}
                    alt="copy"
                    width={18}
                    height={18}
                    className="cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText(data?.how_to_pay[0]?.bill_key);
                      toast.success(t('Success copy Bill Key to clipboard'));
                    }}
                  />
                  {/* <MdContentCopy
                    size={16}
                    className="cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText(data?.how_to_pay[0]?.bill_key);
                      toast.success(t('Success copy Bill Key to clipboard'));
                    }}
                  /> */}
                </div>
              </div>
            </div>
          </div>
        )}

      {(data?.payment_type === 'cardless_credit' ||
        data?.payment_type === 'direct_debit' ||
        data?.payment_method?.payment_type === 'cardless_credit' ||
        data?.payment_method?.payment_type === 'direct_debit') && (
          <div className="flex flex-col gap-5">
            <Link
              href={paymentVideoId?.data?.transaction?.how_to_pay[0]?.redirect_url ?? '/'}
              className="m-auto w-56 py-3 px-4 text-white bg-[#119311] rounded-md text-center">
              {t('Pay Now')}
            </Link>
          </div>
        )}

      {(data?.payment_name ?? data?.payment_method?.payment_name) === 'Gopay' &&
        data?.how_to_pay?.find((res) => res?.name === 'deeplink-redirect') &&
        !isQris && (
          <>
            <Link
              href={data?.how_to_pay?.find((res) => res?.name === 'deeplink-redirect')?.url}
              className="m-auto w-56 py-3 px-4 text-white bg-[#119311] rounded-md text-center font-medium">
              {t('Pay with Gopay')}
            </Link>
          </>
        )}

      {(data?.payment_name ?? data?.payment_method?.payment_name) === 'ShopeePay' &&
        isIos &&
        data?.how_to_pay?.find((res) => res?.name === 'deeplink-redirect') && (
          <>
            <Link
              href={data?.how_to_pay?.find((res) => res?.name === 'deeplink-redirect')?.url}
              className="m-auto w-56 py-3 px-4 text-white bg-[#119311] rounded-md text-center">
              {t('Pay with Shopeepay')}
            </Link>
          </>
        )}

      {/* <button
        className="m-auto w-56 py-3 px-4 text-white border border-zinc-700 rounded-md"
        onClick={() => dispatch(pointApi.util.invalidateTags(['VideoPaymentHistory']))}>
        {t('Check status payment')}
      </button> */}

      {/* cancel button */}
      <button
        className="m-auto w-56 py-3 px-4 text-white underline rounded-md"
        onClick={() => router.replace('/my-account?tab=video#transaction')}>
        {t('Go to Transaction History')}
      </button>

      <div className="mt-10">
        <PaymentsGuide guideList={paymentGuide} />
      </div>
    </>
  );
};

export default VideoPayment;
