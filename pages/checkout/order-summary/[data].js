import { useEffect } from 'react';
import OrderSummaryContent from 'components/checkout/OrderSummary';
import getLayouts from 'utils/getLayouts';
import { useRouter } from 'next/router';
import getCredential from 'core/services/helpers/getCredential';
import SSServices from 'core/services/ServerSide/ssServices';
import { useSelector, useDispatch } from 'react-redux';
import { setCookie } from 'cookies-next';
import Paramcrypt from 'lib/Paramcrypt';

export default function OrderSummary(props) {
  const { payment_for } = useSelector((state) => state.payments);
  const [allEvents, memberships, myPoints, paymentsMembership, paymentVideoUser, paymentPoints, paymentDetail] =
    props.data;
  // const [dataVideo, dataMembership, dataPoints] = props.global;
  console.log('props', props);
  const params = props?.params;
  const dispatch = useDispatch();

  // const detail = () => {
  //   if (payment_for === 'membership' || payment_for === 'membership_detail') {
  //     return 'peymentDetailMembership';
  //   } else if (payment_for === 'points') {
  //     return 'paymentDetailPoints';
  //   } else {
  //     return 'paymentDetailVideo';
  //   }
  // }
  const parsing = {
    allEvents,
    memberships,
    myPoints,
    paymentsMembership,
    paymentDetail,
    paymentVideoUser,
    paymentPoints
  };

  const router = useRouter();

  return (
    <div className="flex flex-col gap-10">
      <OrderSummaryContent data={parsing} />
    </div>
  );
}

OrderSummary.getLayout = (page, props) => getLayouts(page, 'base', props);

export const getServerSideProps = async ({ req, params }) => {
  try {
    let membershipStatus,
      config = [],
      request,
      paymentDetail;
    const { isAuthenticated, token, _userId, payment } = getCredential({ req });
    console
    if (isAuthenticated && token) {
      const paymentJSON = JSON.parse(payment);

      // fetch by payment membership / video / points
      if (paymentJSON?.payment_for === 'video_upload' || paymentJSON?.payment_for === 'video_upload_detail') {
        paymentDetail = SSServices.getPaymentVideoId({
          id: Paramcrypt.decode(params?.data),
          token
        })
      } else if (paymentJSON?.payment_for === 'membership' || paymentJSON?.payment_for === 'membership_detail') {
        paymentDetail = SSServices.getPaymentMembershipId({
          id: Paramcrypt.decode(params?.data),
          token
        });
      } else if (paymentJSON?.payment_for === 'points') {
        paymentDetail = SSServices.getPaymentBuyPointsId({
          id: Paramcrypt.decode(params?.data),
          token
        });
      }
      config = [
        SSServices.getAllEvents(),
        SSServices.getMemberships({ token }),
        SSServices.getMyPoints({ token }),
        SSServices.getPaymentsMembership({ id: _userId, token }),
        SSServices.getPaymentsVideo({ id: _userId, token }),
        SSServices.getPaymentsBuyPoints({ id: _userId, token }),
        paymentDetail // set in bottom
      ]; // mandatory for root used
    }

    request = []; // mandatory for this page

    const data = await Promise.all([...config, ...request]);

    // if (
    //   data[2]?.data &&
    //   data?.[2]?.data?.data?.[0]?.current_contest &&
    //   data?.[2]?.data?.data?.[0]?.memberships
    // ) {
    //   membershipStatus = await SSServices.getMembershipsStatus({
    //     token,
    //     datas: {
    //       event_contest_id: parseInt(data?.[2]?.data?.data?.[0]?.current_contest?.id),
    //       membership_id: parseInt(data?.[2]?.data?.data?.[0]?.memberships?.[0]?.id)
    //     }
    //   });
    // }

    return {
      props: {
        title: 'Order Summary | Abracadbara Starquest',
        data,
        bottomConfig: {
          myPoints: data?.[2] ?? {},
          allEvents: data?.[0] ?? {},
          membershipStatus: membershipStatus ?? {}
        },
        params
      }
    };
  } catch (error) {
    return {
      redirect: {
        permanent: false,
        destination: '/checkout'
      }
    };
  }
};
