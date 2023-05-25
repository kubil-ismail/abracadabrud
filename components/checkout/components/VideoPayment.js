import {
  eventApi,
  useCancelVideoPaymentMutation,
  useGetPaymentVideoIdQuery,
  useGetStatusPaymentVideoQuery
} from '../../../core/services/rtk/EventServices';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { RiHeartLine, RiCloseFill } from 'react-icons/ri';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { setModal } from 'core/redux/reducers/modalSlice';
import Link from 'next/link';
import { guidePayments } from 'store/master.data';
import { FiCopy } from 'react-icons/fi';
import PaymentsGuide from './PaymentsGuide';
import { toast } from 'react-toastify';
import { pointApi } from 'core/services/rtk/MeServices';

const VideoPayment = ({ timer, countDown }) => {
  const router = useRouter();
  const [deepLink, setDeepLink] = useState([]);
  const dispatch = useDispatch();
  const [vaNumber, setVaNumber] = useState('');
  const [billerCode, setBillerCode] = useState('');
  const [billKey, setBillKey] = useState('');
  const [paymentGuide, setPaymentGuide] = useState([]);
  const { event_contest_id, payment_for, isQris } = useSelector((state) => state.payments);

  // video payment
  const {
    data: dataSummary,
    isLoading: isLoadingSummary,
    isSuccess: isSuccessSummary,
    refetch: refetchStatusVideo
  } = useGetStatusPaymentVideoQuery(
    {
      event_contest_id: event_contest_id
    },
    {
      skip: payment_for !== 'video_upload',
      refetchOnFocus: true
    }
  );
  const {
    data: paymentVideoId,
    isLoading: isLoadingPaymentVideoId,
    isSuccess: isSuccessPaymentVideoId,
    refetch: refetchGetDetailVideo
  } = useGetPaymentVideoIdQuery(
    {
      // video_payment_id
      video_contest_id: dataSummary?.data?.video_payment_id
    },
    {
      skip: isLoadingSummary
    }
  );

  const [cancelVideoPayment] = useCancelVideoPaymentMutation();

  useEffect(() => {
    if (paymentVideoId) countDown(paymentVideoId);
  }, [paymentVideoId]);

  useEffect(() => {
    if (payment_for === 'video_upload') {
      if (dataSummary?.data?.status === 'success') {
        router.push('/uploads');
      }
    }
  }, [dataSummary]);

  const cancelPayment = () => {
    const confirm = window.confirm('Are you sure to cancel this payment?');
    if (confirm) {
      cancelVideoPayment({
        video_contest_id: dataSummary?.data?.video_payment_id
      });
      dispatch(pointApi.util.invalidateTags(['VideoPaymentHistory']));
      router.push('/my-account#transaction');
    }
  };

  useEffect(() => {
    const guide = guidePayments.filter(
      (item) => item.payment_code === paymentVideoId?.data?.payment_method?.payment_code
    );
    setPaymentGuide(guide);
  }, [paymentVideoId]);

  const onCopy = (str) => {
    if (typeof window !== 'undefined') {
      const el = document.createElement('textarea');
      el.value = str;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      toast.success('Succeed Copied');
    } else {
      toast.error('Your browser does not support copy to clipboard');
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const numberVirtualAccount = paymentVideoId?.data?.transaction?.how_to_pay[0]?.va_number;
      const numberBillKey = paymentVideoId?.data?.transaction?.how_to_pay[0]?.bill_key;
      const numberBillerCode = paymentVideoId?.data?.transaction?.how_to_pay[0]?.biller_code;
      setVaNumber(numberVirtualAccount);
      setBillKey(numberBillKey);
      setBillerCode(numberBillerCode);
    }
  }, [paymentVideoId]);

  useEffect(() => {
    const linkEwallet = paymentVideoId?.data?.transaction?.how_to_pay?.filter(
      (item) => item.name === 'deeplink-redirect'
    );
    if (linkEwallet) {
      setDeepLink(linkEwallet);
    }
  }, [paymentVideoId]);

  return (
    <>
      <h3 className="text-2xl font-bold text-center">Order Successfully Created</h3>
      <div className="">
        <img src="/assets/images/waiting-payment.png" alt="" className="w-[240px] m-auto" />
      </div>
      <div className="flex flex-col gap-5 text-center">
        <h3 className="text-lg font-bold">
          {isLoadingSummary || isLoadingPaymentVideoId ? 'Loading...' : timer}
        </h3>
        <span className="text-xs md:text-sm font-light">
          Please complete the payment with the information below before{' '}
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
      {paymentVideoId?.data?.payment_method?.payment_type === 'virtual_account' && (
        <div className="bg-zinc-800 px-4 py-3 rounded-md w-full max-w-2xl md:m-auto">
          {paymentVideoId?.data?.transaction?.how_to_pay[0]?.va_number && (
            <div className="flex justify-between items-center">
              <span className="text-xs md:text-sm flex flex-col gap-5 uppercase">{`Virtual Account ${paymentVideoId?.data?.transaction?.how_to_pay[0]?.bank}`}</span>
              <div className="flex items-center gap-4">
                <span className="text-xs md:text-sm flex flex-col gap-5">
                  {paymentVideoId?.data?.transaction?.how_to_pay[0]?.va_number}
                </span>
                <FiCopy size={16} className="cursor-pointer" onClick={() => onCopy(vaNumber)} />
              </div>
            </div>
          )}
          {paymentVideoId?.data?.transaction?.how_to_pay[0]?.bill_key && (
            <div className="flex justify-between items-center">
              <span className="text-xs md:text-sm flex flex-col gap-5">
                {paymentVideoId?.data?.payment_method?.payment_name}
              </span>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4 justify-end">
                  <div className="flex gap-1 items-baseline">
                    <span className="text-[10px] text-zinc-300 font-light">( Bill Key )</span>
                    <span className="text-xs md:text-sm flex flex-col gap-5">
                      {paymentVideoId?.data?.transaction?.how_to_pay[0]?.biller_code}
                    </span>
                  </div>
                  <FiCopy size={16} className="cursor-pointer" onClick={() => onCopy(billerCode)} />
                </div>
                <div className="flex items-center gap-4 justify-end">
                  <span className="text-xs md:text-sm flex flex-col gap-5">
                    {paymentVideoId?.data?.transaction?.how_to_pay[0]?.bill_key}
                  </span>
                  <FiCopy size={16} className="cursor-pointer" onClick={() => onCopy(billKey)} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {/* <div className="flex flex-col gap-5">
        Payment Method: {paymentVideoId?.data?.payment_method?.payment_name}
      </div> */}
      {paymentVideoId?.data?.payment_method?.payment_type === 'ewallet' && (
        <div className="flex flex-col gap-5 md:max-w-4xl md:m-auto">
          {/* Home To Pay: */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-5 items-center">
              <img
                src={paymentVideoId?.data?.transaction?.how_to_pay[0]?.url}
                alt=""
                className="w-[260px] m-auto"
              />
              <Link href={`${deepLink[0]?.url}`}>
                <button className="w-48 py-2 text-white bg-[#00ff0d] rounded-md">Pay Now</button>
              </Link>
            </div>
          </div>
        </div>
      )}
      {paymentVideoId?.data?.payment_method?.payment_type === 'outlet' && (
        <div className="bg-zinc-800 px-4 py-3 rounded-md w-full max-w-2xl md:m-auto">
          <div className="flex justify-between items-center">
            <span className="text-xs md:text-sm flex flex-col gap-5 uppercase">
              {paymentVideoId?.data?.payment_method?.payment_name}
            </span>
            <div className="flex items-center gap-4">
              <span className="text-xs md:text-sm flex flex-col gap-5">
                {paymentVideoId?.data?.transaction?.how_to_pay[0]?.payment_code}
              </span>
              <FiCopy size={16} className="cursor-pointer" />
            </div>
          </div>
        </div>
      )}
      <div className="max-w-2xl md:m-auto flex justify-end">
        <div className="flex items-center gap-4">
          {paymentVideoId?.data?.payment_method?.payment_type === 'cardless_credit' ||
            (paymentVideoId?.data?.payment_method?.payment_type === 'direct_debit' && (
              <div className="flex flex-col gap-5">
                <Link
                  href={paymentVideoId?.data?.transaction?.how_to_pay[0]?.redirect_url}
                  className="w-32 py-2 text-white bg-[#03c312] rounded-md text-center">
                  Pay Now
                </Link>
              </div>
            ))}
          {isLoadingPaymentVideoId ? (
            'Loading...'
          ) : (
            <button
              className="w-48 py-2 text-white bg-[#ff0052] rounded-md"
              onClick={() => cancelPayment()}>
              Cancel Payment
            </button>
          )}
        </div>
      </div>

      {/* cancel button */}
      <div className="mt-10">
        <PaymentsGuide guideList={paymentGuide} />
      </div>
    </>
  );
};

export default VideoPayment;
