import {
  eventApi,
  useCancelMembershipPaymentMutation,
  useGetPaymentMembershipIdQuery,
  useGetStatusPaymentMembershipQuery
} from 'core/services/rtk/EventServices';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { guidePayments } from 'store/master.data';
import { FiCopy } from 'react-icons/fi';
import { toast } from 'react-toastify';
import PaymentsGuide from './PaymentsGuide';
import Link from 'next/link';

const MembershipPayment = ({ timer, countDown }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [vaNumber, setVaNumber] = useState('');
  const [billerCode, setBillerCode] = useState('');
  const [billKey, setBillKey] = useState('');
  const [deepLink, setDeepLink] = useState([]);
  const [paymentGuide, setPaymentGuide] = useState([]);
  const { event_contest_id, payment_for, membership_id } = useSelector((state) => state.payments);
  const { data } = router.query;

  // membership payment
  const {
    data: dataMembership,
    isLoading: isLoadingMembership,
    isSuccess: isSuccessMembership,
    refetch: refetchStatusMembership
  } = useGetStatusPaymentMembershipQuery(
    {
      event_contest_id: event_contest_id,
      membership_id: membership_id
    },
    {
      skip: payment_for !== 'membership',
      refetchOnFocus: true
    }
  );
  const {
    data: paymentMembershipId,
    isLoading: isLoadingPaymentMembershipId,
    isSuccess: isSuccessPaymentMembershipId,
    refetch: refetchGetDetailMembership
  } = useGetPaymentMembershipIdQuery(
    {
      // membership_payment_id
      membership_id: dataMembership?.data?.membership_payment
    },
    {
      skip: dataMembership?.data?.status !== 'pending',
      refetchOnFocus: true
    }
  );

  const [
    cancelMembershipPayment,
    {
      isLoading: isLoadingCancelPaymentMembership,
      isSuccess: isSuccessCancelPaymentMembership,
      isError: isErrorCancelPaymentMembership,
      error: errorCancelPaymentMembership
    }
  ] = useCancelMembershipPaymentMutation();

  useEffect(() => {
    dispatch(eventApi.util.invalidateTags(['PaymentMembership']));
  }, []);

  useEffect(() => {
    if (paymentMembershipId) countDown(paymentMembershipId);
  }, [paymentMembershipId]);

  useEffect(() => {
    if (payment_for === 'membership') {
      if (dataMembership?.data?.status === 'success') {
        router.push('/');
      }
    }
  }, [dataMembership]);

  const cancelPayment = () => {
    const confirm = window.confirm('Are you sure to cancel this payment?');
    if (confirm) {
      cancelMembershipPayment({
        membership_id: dataMembership?.data?.membership_payment
      });
      router.push('/my-account#transaction')
    }
  };

  useEffect(() => {
    if (isSuccessCancelPaymentMembership) {
      router.replace('/my-account#transaction');
      dispatch(pointApi.util.invalidateTags(['MembershipPaymentHistory']));
      dispatch(eventApi.util.invalidateTags([{ type: 'PaymentMembership', id: dataMembership?.data?.membership_payment }]));
    }
  }, [isSuccessCancelPaymentMembership]);

  useEffect(() => {
    const guide = guidePayments.filter((item) => item.payment_code === paymentMembershipId?.data?.payment_method?.payment_code);
    setPaymentGuide(guide);
  }, [paymentMembershipId]);

  const onCopy = (str) => {
    if (typeof window !== 'undefined') {
      const el = document.createElement('textarea');
      el.value = str;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      toast.success(t('Succeed Copied'));
    } else {
      toast.error(t('Your browser does not support copy to clipboard'));
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const numberVirtualAccount = paymentMembershipId?.data?.transaction?.how_to_pay[0]?.va_number;
      const numberBillKey = paymentMembershipId?.data?.transaction?.how_to_pay[0]?.bill_key;
      const numberBillerCode = paymentMembershipId?.data?.transaction?.how_to_pay[0]?.biller_code;
      setVaNumber(numberVirtualAccount);
      setBillKey(numberBillKey);
      setBillerCode(numberBillerCode);
    }
  }, [paymentMembershipId]);

  useEffect(() => {
    const linkEwallet = paymentMembershipId?.data?.transaction?.how_to_pay?.filter((item) => item.name === 'deeplink-redirect');
    if (linkEwallet) {
      setDeepLink(linkEwallet);
    }
  }, [paymentMembershipId]);

  return (
    <>
      <h3 className="text-2xl font-bold text-center">Order Successfully Created</h3>
      <div className="">
        <img
          src="/assets/images/waiting-payment.png"
          alt=""
          className="w-[240px] m-auto"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col gap-5 text-center">
        <h3 className="text-lg font-bold">
          {isLoadingMembership || isLoadingPaymentMembershipId ? 'Loading...' : timer}
        </h3>
        <span className="text-xs font-light">
          Please complete the payment with the information below before{' '}
          {new Date(paymentMembershipId?.data?.transaction?.expired_at).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
          })}
        </span>
      </div>
      {paymentMembershipId?.data?.payment_method?.payment_type === 'virtual_account' && (
        <div className="bg-zinc-800 px-4 py-3 rounded-md w-full max-w-2xl md:m-auto">
          {paymentVideoId?.data?.transaction?.how_to_pay[0]?.va_number && (
            <div className="flex justify-between items-center">
              <span className="text-xs md:text-sm flex flex-col gap-5 uppercase">{`Virtual Account ${paymentMembershipId?.data?.transaction?.how_to_pay[0]?.bank}`}</span>
              <div className="flex items-center gap-4">
                <span className="text-xs md:text-sm flex flex-col gap-5">
                  {paymentMembershipId?.data?.transaction?.how_to_pay[0]?.va_number}
                </span>
                <FiCopy size={16} className="cursor-pointer" onClick={() => onCopy(vaNumber)} />
              </div>
            </div>
          )}
          {paymentMembershipId?.data?.transaction?.how_to_pay[0]?.bill_key && (
            <div className="flex justify-between items-center">
              <span className="text-xs md:text-sm flex flex-col gap-5">
                {paymentMembershipId?.data?.payment_method?.payment_name}
              </span>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4 justify-end">
                  <div className="flex gap-1 items-baseline">
                    <span className="text-[10px] text-zinc-300 font-light">( Bill Key )</span>
                    <span className="text-xs md:text-sm flex flex-col gap-5">
                      {paymentMembershipId?.data?.transaction?.how_to_pay[0]?.biller_code}
                    </span>
                  </div>
                  <FiCopy size={16} className="cursor-pointer" onClick={() => onCopy(billerCode)} />
                </div>
                <div className="flex items-center gap-4 justify-end">
                  <span className="text-xs md:text-sm flex flex-col gap-5">
                    {paymentMembershipId?.data?.transaction?.how_to_pay[0]?.bill_key}
                  </span>
                  <FiCopy size={16} className="cursor-pointer" onClick={() => onCopy(billKey)} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {/* <div className="flex flex-col gap-5">Order id: {paymentMembershipId?.data?.order_id}</div>
      <div className="flex flex-col gap-5">
        Payment Method: {paymentMembershipId?.data?.payment_method?.payment_name}
      </div> */}
      {paymentMembershipId?.data?.payment_method?.payment_type === 'ewallet' && (
        <div className="flex flex-col gap-5 md:max-w-4xl md:m-auto">
          Home To Pay:
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-5 items-center">
              <img
                src={paymentMembershipId?.data?.transaction?.how_to_pay[0]?.url}
                alt=""
                className="w-[260px] m-auto"
                loading="lazy"
              />
              <Link href={`${deepLink[0]?.url}`}>
                <button className="w-48 py-2 text-white bg-[#00ff0d] rounded-md m-auto">
                  Pay Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
      {paymentMembershipId?.data?.payment_method?.payment_type === 'outlet' && (
        // <div className="flex flex-col gap-5">
        //   Code/Account Number: {paymentMembershipId?.data?.transaction?.how_to_pay[0]?.payment_code}
        // </div>
        // <div className="bg-zinc-800 px-4 py-3 rounded-md w-full max-w-2xl md:m-auto">
        //   <div className="flex justify-between items-center">
        //     <span className="text-xs md:text-sm flex flex-col gap-5 uppercase">{paymentMembershipId?.data?.payment_method?.payment_name}</span>
        //     <div className="flex items-center gap-4">
        //       <span className="text-xs md:text-sm flex flex-col gap-5">{paymentMembershipId?.data?.transaction?.how_to_pay[0]?.payment_code}</span>
        //       <FiCopy size={16} className="cursor-pointer" />
        //     </div>
        //   </div>
        // </div>
        <div className="bg-zinc-800 px-4 py-3 rounded-md w-full max-w-2xl md:m-auto">
          <div className="flex justify-between items-center">
            <span className="text-xs md:text-sm flex flex-col gap-5 uppercase">
              {paymentMembershipId?.data?.payment_method?.payment_name}
            </span>
            <div className="flex items-center gap-4">
              <span className="text-xs md:text-sm flex flex-col gap-5">
                {paymentMembershipId?.data?.transaction?.how_to_pay[0]?.payment_code}
              </span>
              <FiCopy size={16} className="cursor-pointer" />
            </div>
          </div>
        </div>
      )}
      <div className="max-w-2xl md:m-auto flex justify-end">
        <div className="flex items-center gap-5">
          {paymentMembershipId?.data?.payment_method?.payment_type === 'cardless_credit' ||
            (paymentMembershipId?.data?.payment_method?.payment_type === 'direct_debit' && (
              <div className="flex flex-col gap-5">
                <Link
                  href={paymentMembershipId?.data?.transaction?.how_to_pay[0]?.redirect_url}
                  className="w-32 py-2 text-white bg-[#03c312] rounded-md text-center">
                  Pay Now
                </Link>
              </div>
            ))}
          {/* cancel button */}
          {isLoadingPaymentMembershipId ? (
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
      <div className="mt-10">
        <PaymentsGuide guideList={paymentGuide} />
      </div>
    </>
  );
};

export default MembershipPayment;
