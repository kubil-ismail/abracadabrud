import SSServices from 'core/services/ServerSide/ssServices';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { isAndroid } from 'react-device-detect';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { guidePayments } from 'store/master.data';
import PaymentsGuide from './PaymentsGuide';
import { setRefetchNotifications } from 'core/redux/reducers/notificationSlice';

const PointsPayment = (props) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { data, payment_for, isQris } = useSelector((state) => state.payments);
    const { user, token } = useSelector((state) => state.authentication);
    const [paymentGuide, setPaymentGuide] = useState([]);
    const [timer_3, setTimer_3] = useState('Loading...');
    const [isIos, setIsIos] = useState(false);
    const paymentPointsId = props?.data?.paymentDetail;
    // const paymentPointsCC = props?.data?.paymentPoints?.data?.filter((item) => item.status === 1)[0];
    // const paymentPointsCCCancelled = props?.data?.paymentPoints?.data?.filter((item) => item.status === 4)[0];
    // const paymentPointsCCExpired = props?.data?.paymentPoints?.data?.filter((item) => item.status === 3)[0];
    const isCC = paymentPointsId?.data?.payment_method?.payment_type === 'credit_card';

    const countDownPoints = (data) => {
        let x;
        if (payment_for === 'points') {
            if (data) {
                const countDownDate = moment(data?.data?.transaction?.expired_at).get();
                x = setInterval(() => {
                    const now = new Date().getTime();
                    const distance = countDownDate - now;

                    if (distance < 0 || !distance) {
                        setTimer_3('EXPIRED');
                        return () => {
                            clearInterval(x);
                        };
                    } else {
                        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                        setTimer_3(`${hours}:${minutes}:${seconds}`);
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
        if (isCC) {
            return;
        }
        const guide = guidePayments.filter((item) =>
            isQris
                ? item.payment_code === paymentPointsId?.data?.payment_method?.payment_code &&
                item.isQris
                : item.payment_code === paymentPointsId?.data?.payment_method?.payment_code &&
                !item.isQris
        );
        setPaymentGuide(guide);
    }, [paymentPointsId]);

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

    useEffect(() => {
        setTimer_3('Loading...');
        if (paymentPointsId) countDownPoints(paymentPointsId);
    }, [paymentPointsId]);

    const checkCC = () => {
        SSServices.getPaymentBuyPointsId({
            id: paymentPointsId?.data?.id ?? data?.id,
            token,
            client: true
        }).then((result) => {
            if (result?.data?.transaction?.status === 2) {
                toast.success(t('Payment success, redirect to profile...'));
                router.replace('/my-account?tab=points#transaction');
            } else if (result?.data?.transaction?.status === 3) {
                toast.error(t('Payment expired, redirect to profile...'));
                router.replace(`/my-account?tab=points#transaction`);
            } else if (result?.data?.transaction?.status === 4) {
                toast.error(t('Payment canceled, redirect to profile...'));
                router.replace(`/my-account?tab=points#transaction`);
            }
            dispatch(setRefetchNotifications(true));
        });
    };

    useEffect(() => {
        if (payment_for === 'points') {
            let interval = setInterval(() => {
                SSServices.getPaymentBuyPointsId({
                    id: paymentPointsId?.data?.id ?? data?.id,
                    token,
                    client: true
                }).then((result) => {
                    if (result?.data?.transaction?.status === 2) {
                        toast.success(t('Payment success, redirect to profile...'));
                        clearInterval(interval);
                        router.replace('/my-account?tab=points#transaction');
                    } else if (result?.data?.transaction?.status === 3) {
                        clearInterval(interval);
                        toast.error(t('Payment expired, redirect to profile...'));
                        router.replace('/my-account?tab=points#transaction');
                    } else if (result?.data?.transaction?.status === 4) {
                        clearInterval(interval);
                        toast.error(t('Payment canceled, redirect to profile...'));
                        router.replace('/my-account?tab=points#transaction');
                    }
                    dispatch(setRefetchNotifications(true));
                });
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [props]);

    return (
        <>
            <h3 className="text-2xl font-bold text-center">
                {t('Order Points Successfully Created')}
            </h3>
            <div className="">
                <Image
                    src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/waiting-payment.png`}
                    alt="waiting-payment"
                    width={240}
                    height={240}
                    className="m-auto"
                />
                {/* <img src="/assets/images/waiting-payment.png" alt="" className="w-[240px] m-auto" /> */}
            </div>

            <div className="flex flex-col space-y-5 text-center">
                <h3 className="text-lg font-bold">{timer_3}</h3>
                <span className="text-xs font-light">
                    {t('Please complete the payment with the information below before')}{' '}
                    {new Date(paymentPointsId?.data?.transaction?.expired_at).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true
                    })}
                </span>
            </div>

            {(isCC) && (
                <div className="flex flex-col space-y-5">
                    {/* Snap Midtrans */}
                    <button
                        className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                        onClick={() => {
                            if (isCC) {
                                snap.pay(paymentPointsId?.data?.transaction?.how_to_pay?.[0]?.snap_token, {
                                    // onSuccess: function (result) {
                                    //     toast.success(t('Payment success, redirect to profile...'));
                                    //     setTimeout(() => {
                                    //         router.replace('/my-account?tab=points#transaction');
                                    //     }, 3000);
                                    // },
                                    // onError: function (result) {
                                    //     toast.error(t('Payment failed, please try again later...'));
                                    //     setTimeout(() => {
                                    //         router.replace('/my-account?tab=points#transaction');
                                    //     }, 3000);
                                    // },
                                    // onClose: function () {
                                    //     checkCC();
                                    // }
                                });
                            }
                        }}>
                        {t('Pay with Credit Card')}
                    </button>
                </div>
            )}
            {/* Mobile phone olny alert */}
            {(data?.payment_name ?? paymentPointsId?.data?.payment_method?.payment_name) === 'ShopeePay' && !isIos && (
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

            {(data?.payment_type === 'ewallet' || paymentPointsId?.data?.payment_method?.payment_type === 'ewallet') &&
                (data?.how_to_pay?.find((res) => res?.name === 'generate-qr-code') ||
                    paymentPointsId?.data?.transaction?.how_to_pay?.find((res) => res?.name === 'generate-qr-code')
                ) && (
                    <div className="flex flex-col space-y-5 max-w-2xl md:m-auto">
                        <p className="text-center">{t('How To Pay:')}</p>
                        <div className="flex flex-col space-y-5">
                            <div className="flex flex-col space-y-5 mt-3">
                                <img
                                    src={paymentPointsId?.data?.transaction?.how_to_pay?.[0]?.url}
                                    alt=""
                                    className="w-[250px] md:w-[320px] m-auto"
                                />
                            </div>
                        </div>

                        <p className="text-center">{t('Or')}</p>
                    </div>
                )}

            {(data?.payment_type === 'outlet' || paymentPointsId?.data?.payment_method?.payment_type === 'outlet') && (
                <div className="bg-zinc-800 px-4 py-3 rounded-md w-full max-w-2xl md:m-auto">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            {paymentPointsId?.data?.payment_method?.payment_image?.image && (
                                <img src={paymentPointsId?.data?.payment_method?.payment_image?.image} alt="logo" className="w-12" />
                            )}

                            <span className="text-xs md:text-sm flex flex-col gap-5">
                                {data?.payment_name ?? paymentPointsId?.data?.payment_method?.payment_name}
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-xs md:text-sm flex flex-col gap-5">
                                {paymentPointsId?.data?.transaction?.how_to_pay?.[0]?.payment_code}
                            </span>
                            <Image
                                src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/copy-icon.png`}
                                alt="copy"
                                width={18}
                                height={18}
                                className="cursor-pointer"
                                onClick={() => {
                                    navigator.clipboard.writeText(
                                        data?.how_to_pay?.[0]?.payment_code ??
                                        paymentPointsId?.data?.transaction?.how_to_pay?.[0]?.payment_code
                                    );
                                    toast.success(t('Success copy code to clipboard'));
                                }}
                            />
                            {/* <MdContentCopy
                size={16}
                className="cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(
                    paymentPointsId?.data?.transaction?.how_to_pay?.[0]?.payment_code
                  );
                  toast.success(t('Success copy code to clipboard'));
                }}
              /> */}
                        </div>
                    </div>
                </div>
            )}

            {/* check if not mandiri account */}
            {(data?.payment_type || paymentPointsId?.data?.payment_method?.payment_type) === 'virtual_account' &&
                (data?.payment_code || paymentPointsId?.data?.payment_method?.payment_code) !== 'va_mandiri' && (
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
                                {paymentPointsId?.data?.payment_method?.payment_image?.image && (
                                    <img
                                        src={paymentPointsId?.data?.payment_method?.payment_image?.image}
                                        alt="logo"
                                        className="w-12"
                                    />
                                )}
                                <span className="text-xs md:text-sm flex flex-col gap-5">
                                    {data?.payment_name ?? paymentPointsId?.data?.payment_method?.payment_name}
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-xs md:text-sm flex flex-col gap-5">
                                    {data?.how_to_pay?.[0]?.va_number || paymentPointsId?.data?.transaction?.how_to_pay?.[0]?.va_number}
                                </span>

                                <Image
                                    src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/copy-icon.png`}
                                    alt="copy"
                                    width={18}
                                    height={18}
                                    className="cursor-pointer"
                                    onClick={() => {
                                        navigator.clipboard.writeText(data?.how_to_pay?.[0]?.va_number ||
                                            paymentPointsId?.data?.transaction?.how_to_pay?.[0]?.va_number
                                        );
                                        toast.success(t('Success copy virtual account to clipboard'));
                                    }}
                                />
                                {/* <MdContentCopy
                  size={16}
                  className="cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(data?.how_to_pay?.[0]?.va_number);
                    toast.success(t('Success copy virtual account to clipboard'));
                  }}
                /> */}
                            </div>
                        </div>
                    </div>
                )}

            {(data?.payment_type || paymentPointsId?.data?.payment_method?.payment_type) === 'virtual_account' &&
                (data?.payment_code || paymentPointsId?.data?.payment_method?.payment_code) === 'va_mandiri' && (
                    <div className="bg-zinc-800 px-4 py-3 rounded-md w-full max-w-2xl md:m-auto">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                {data?.payment_image?.image && (
                                    <img
                                        src={data?.payment_image?.image}
                                        alt="logo"
                                        className="w-12"
                                    />
                                )}
                                {paymentPointsId?.data?.payment_method?.payment_image?.image && (
                                    <img
                                        src={paymentPointsId?.data?.payment_method?.payment_image?.image}
                                        alt="logo"
                                        className="w-12"
                                    />
                                )}
                                <span className="text-xs md:text-sm flex flex-col gap-5">
                                    {data?.payment_name ?? paymentPointsId?.data?.payment_method?.payment_name}
                                </span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-4 justify-end">
                                    <div className="flex gap-1 items-baseline">
                                        <span className="text-[10px] text-zinc-300 font-light">( Bill Key )</span>
                                        <span className="text-xs md:text-sm flex flex-col gap-5">
                                            {data?.how_to_pay?.[0]?.biller_code || paymentPointsId?.data?.transaction?.how_to_pay?.[0]?.biller_code}
                                        </span>
                                    </div>
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/copy-icon.png`}
                                        alt="copy"
                                        width={18}
                                        height={18}
                                        className="cursor-pointer"
                                        onClick={() => {
                                            navigator.clipboard.writeText(data?.how_to_pay?.[0]?.biller_code || paymentPointsId?.data?.transaction?.how_to_pay?.[0]?.biller_code);
                                            toast.success(t('Success copy Billing Code to clipboard'));
                                        }}
                                    />

                                    {/* <MdContentCopy
                    size={16}
                    className="cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText(data?.how_to_pay?.[0]?.biller_code);
                      toast.success(t('Success copy Billing Code to clipboard'));
                    }}
                  /> */}
                                </div>
                                <div className="flex items-center gap-4 justify-end">
                                    <span className="text-xs md:text-sm flex flex-col gap-5">
                                        {data?.how_to_pay?.[0]?.bill_key || paymentPointsId?.data?.transaction?.how_to_pay?.[0]?.bill_key}
                                    </span>
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/copy-icon.png`}
                                        alt="copy"
                                        width={18}
                                        height={18}
                                        className="cursor-pointer"
                                        onClick={() => {
                                            navigator.clipboard.writeText(data?.how_to_pay?.[0]?.bill_key || paymentPointsId?.data?.transaction?.how_to_pay?.[0]?.bill_key);
                                            toast.success(t('Success copy Biiling Number to clipboard'));
                                        }}
                                    />
                                    {/* <MdContentCopy
                    size={16}
                    className="cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText(data?.how_to_pay?.[0]?.bill_key);
                      toast.success(t('Success copy Biiling Number to clipboard'));
                    }}
                  /> */}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            {((data?.payment_type === 'cardless_credit' ||
                paymentPointsId?.data?.payment_method?.payment_type === 'cardless_credit' ||
                data?.payment_type === 'direct_debit' ||
                paymentPointsId?.data?.payment_method?.payment_type === 'direct_debit') && (
                    <div className="flex flex-col space-y-5">
                        <Link
                            href={data?.how_to_pay?.[0]?.redirect_url || paymentPointsId?.data?.transaction?.how_to_pay?.[0]?.redirect_url}
                            className="m-auto w-56 py-3 px-4 text-white bg-[#119311] rounded-md text-center">
                            {t('Pay Now')}
                        </Link>
                    </div>
                ))}

            {/* Pay with gopay */}
            {(data?.payment_name === 'Gopay' || paymentPointsId?.data?.payment_method?.payment_name === 'Gopay') &&
                (data?.how_to_pay?.find((res) => res?.name === 'deeplink-redirect')?.url ||
                    paymentPointsId?.data?.transaction?.how_to_pay?.find((res) => res?.name === 'deeplink-redirect')?.url) &&
                !isQris && (
                    <>
                        <Link
                            href={data?.how_to_pay?.find((res) => res?.name === 'deeplink-redirect')?.url ||
                                paymentPointsId?.data?.transaction?.how_to_pay?.find((res) => res?.name === 'deeplink-redirect')?.url}
                            className="m-auto w-56 py-3 px-4 text-white bg-[#119311] rounded-md text-center">
                            {t('Pay with Gopay')}
                        </Link>
                    </>
                )}

            {(data?.payment_name === 'ShopeePay' || paymentPointsId?.data?.payment_method?.payment_name === 'ShopeePay') &&
                (data?.how_to_pay?.find((res) => res?.name === 'deeplink-redirect')?.url ||
                    paymentPointsId?.data?.transaction?.how_to_pay?.find((res) => res?.name === 'deeplink-redirect')?.url) &&
                (
                    <>
                        <Link
                            href={data?.how_to_pay?.find((res) => res?.name === 'deeplink-redirect')?.url ||
                                paymentPointsId?.data?.transaction?.how_to_pay?.find((res) => res?.name === 'deeplink-redirect')?.url}
                            className="m-auto w-56 py-3 px-4 text-white bg-[#119311] rounded-md text-center">
                            {t('Pay with Shopeepay')}
                        </Link>
                    </>
                )}

            {/* <button
        className="m-auto w-56 py-3 px-4 text-white border border-zinc-700 rounded-md"
        onClick={() => dispatch(pointApi.util.invalidateTags(['MembershipPaymentHistory']))}>
        {t('Check status payment')}
      </button> */}

            {/* cancel button */}
            <button
                className="m-auto w-56 py-3 px-4 text-white underline rounded-md"
                onClick={() => router.replace('/my-account?tab=points#transaction')}>
                {t('Go to Transaction History')}
            </button>

            {(!isCC) && (
                <div className="mt-10">
                    <PaymentsGuide guideList={paymentGuide} />
                </div>
            )}
        </>
    );
};

export default PointsPayment;


