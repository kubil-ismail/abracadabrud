import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import VideoPaymentDetail from './components/VideoPaymentDetail';
import MembershipPaymentDetail from './components/MembershipPaymentDetail';
import PointsPaymentDetail from './components/PointsPaymentDetail';
import {
  useCancelMembershipPaymentMutation,
  useCancelVideoPaymentMutation
} from 'core/services/rtk/EventServices';
import { pointApi } from 'core/services/rtk/MeServices';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

export default function OrderSummaryContent(props) {
  // const router = useRouter();
  // const dispatch = useDispatch();
  // const { t } = useTranslation();
  const { payment_for } = useSelector((state) => state.payments);
  // const [timer_1, setTimer_1] = useState('Loading...');
  // const [timer_2, setTimer_2] = useState('Loading...');
  // const [datas, setDatas] = useState(null);

  const [cancelMembershipPayment, { isSuccess: isSuccessCancelPaymentMembership }] =
    useCancelMembershipPaymentMutation();

  const [cancelVideoPayment, { isSuccess: isSuccessCancelPaymentVideo }] =
    useCancelVideoPaymentMutation();

  // const [cancelPointsPayment, { isSuccess: isSuccessCancelPaymentPoints }] =
  //   useCancelPointsPaymentMutation();

  // useEffect(() => {
  //   setDatas(null);
  // }, []);

  // useEffect(() => {
  //   // if router back to checkout page redirect to dashboard
  //   if (timer_1 === 'EXPIRED' || timer_2 === 'EXPIRED') {
  //     if (payment_for === 'membership' || payment_for === 'membership_detail') {
  //       cancelMembershipPayment({
  //         membership_id: datas?.data?.id
  //       });
  //     }

  //     if (payment_for === 'video_upload' || payment_for === 'video_upload_detail') {
  //       cancelVideoPayment({
  //         video_contest_id: datas?.data?.id
  //       });
  //     }

  //     setTimeout(() => {
  //       router.replace('/my-account?tab=membership#transaction');
  //     }, 4000);
  //   }
  // }, [timer_1, timer_2]);

  return (
    <div className="flex flex-col space-y-5">
      {(payment_for === 'video_upload' || payment_for === 'video_upload_detail') && (
        <VideoPaymentDetail
          // cancelVideoPayment={(props) => cancelVideoPayment(props)}
          // isSuccessCancelPaymentVideo={isSuccessCancelPaymentVideo}
          {...props}
        />
      )}
      {(payment_for === 'membership' || payment_for === 'membership_detail') && (
        <MembershipPaymentDetail
          // cancelMembershipPayment={cancelMembershipPayment}
          // isSuccessCancelPaymentMembership={isSuccessCancelPaymentMembership}
          {...props}
        />
      )}
      {payment_for === 'points' && (
        <PointsPaymentDetail
          // cancelPointsPayment={cancelPointsPayment}
          // isSuccessCancelPaymentPoints={isSuccessCancelPaymentPoints}
          {...props}
        />
      )}
    </div>
  );
}
