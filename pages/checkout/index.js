import { useEffect, useRef, useState } from 'react';
import BankTransfer from 'components/checkout/BankTransfer';
import CardSummary from 'components/checkout/CardSummary';
// import CreditCard from 'components/checkout/CreditCard';
import Ewallet from 'components/checkout/E-Wallet';
import Minimarket from 'components/checkout/Minimarket';
import getLayouts from 'utils/getLayouts';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import VirtualAccount from 'components/checkout/VirtualAccount';
import CardlessCredit from 'components/checkout/CardlessCredit';
import Paramcrypt from 'lib/Paramcrypt';
import { setData } from 'core/redux/reducers/paymentsSlice';
import { useTranslation } from 'react-i18next';
import { isAndroid } from 'react-device-detect';
import { deleteCookie, setCookie } from 'cookies-next';
import SSServices from 'core/services/ServerSide/ssServices';
import getCredential from 'core/services/helpers/getCredential';

export default function Checkout(props) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isIos, setIsIos] = useState(false);
  const { t } = useTranslation();
  const { payment_for } = useSelector((state) => state.payments);
  const paymentMethods = props?.data?.[3]?.data ?? [];
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useSelector((state) => state.authentication);

  console.log('props', props);

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

    if (paymentMethods.length > 0) {
      setIsLoading(false);
    }
  }, []);

  return isLoading ? (
    <>
      <div className="flex justify-center items-center h-[70vh] blank-screen">
        <div>
          <div class="flex items-center justify-center mb-4">
            <div role="status">
              <svg
                aria-hidden="true"
                class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
              <span class="sr-only">Loading...</span>
            </div>
          </div>
          <p>Loading...</p>
        </div>
      </div>
    </>
  ) : (
    <div className="flex flex-col space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-16">
        <div className="w-full order-1 md:order-2">
          <CardSummary paymentMethods={paymentMethods} />
        </div>
        <div className="md:col-span-2 mt-10 md:mt-0 flex flex-col space-y-8 order-2 md:order-1 md:max-w-2xl">
          <h3 className="text-lg md:text-2xl font-bold">{t('Choose Payment Method')}</h3>
          <Ewallet paymentMethods={paymentMethods} isPhone={isIos} />
          <VirtualAccount paymentMethods={paymentMethods} />
          {/* <CreditCard paymentMethods={paymentMethods} /> */}
          <Minimarket paymentMethods={paymentMethods} />
          <BankTransfer paymentMethods={paymentMethods} />
          <CardlessCredit paymentMethods={paymentMethods} />
        </div>
      </div>
    </div>
  );
}

Checkout.getLayout = (page, props) => getLayouts(page, 'base', props);

export const getServerSideProps = async ({ req }) => {
  let membershipStatus,
    config = [],
    request,
    global = [];
  const { isAuthenticated, token, _userId, payment } = getCredential({ req });

  if (isAuthenticated && token) {
    config = [
      SSServices.getAllEvents(),
      SSServices.getMemberships({ token }),
      SSServices.getMyPoints({ token }),
      SSServices.getPaymentMethod({ token, platform: 1 }),
      SSServices.getPaymentsVideo({ client: false, token, id: _userId }),
      SSServices.getPaymentsMembership({ client: false, token, id: _userId }),
      SSServices.getPaymentsBuyPoints({ client: false, token, id: _userId })
    ]; // mandatory for root used
  }

  request = []; // mandatory for this page

  const data = await Promise.all([...config, ...request]);

  const pendingVideo = await data?.[4]?.data?.filter((item) => item.status === 1)[0] ?? {};
  const pendingMembership = await data?.[5]?.data?.filter((item) => item.status === 1)[0] ?? {};
  const pendingBuyPoints = await data?.[6]?.data?.filter((item) => item.status === 1)[0] ?? {};

  global = await Promise.all([
    SSServices.getPaymentVideoId({ token, id: pendingVideo?.id }),
    SSServices.getPaymentMembershipId({ token, id: pendingMembership?.id }),
    SSServices.getPaymentBuyPointsId({ token, id: pendingBuyPoints?.id })
  ]);

  // global = [
  //   SSServices.getPaymentVideoId({ token, id: pendingVideo?.id }),
  //   SSServices.getPaymentMembershipId({ token, id: pendingMembership?.id }),
  //   SSServices.getPaymentBuyPointsId({ token, id: pendingBuyPoints?.id })
  // ];

  // const globalData = await Promise.all(global);

  const props = {
    title: 'Checkout | Abracadbara Starquest',
    data,
    global,
    bottomConfig: {
      myPoints: data?.[2] ?? {},
      allEvents: data?.[0] ?? {},
      membershipStatus: membershipStatus ?? {}
    }
  }

  if (global?.[0]?.data?.transaction?.status === 1) {
    return {
      redirect: {
        destination: `/checkout/order-summary/${Paramcrypt.encode(
          pendingVideo?.id ?? new Date().toDateString()
        )}`,
        permanent: false
      },
      props: { ...props }
    }
  } else if (global?.[1]?.data?.transaction?.status === 1) {
    // setCookie(
    //   'payment',
    //   JSON.stringify({
    //     user_contest_membership_id: pendingMembership?.user_contest_membership_id,
    //     id: pendingMembership?.id,
    //     'membership'
    //   })
    // );
    // dispatch(setData(global?.[1]?.data));
    return {
      redirect: {
        destination: `/checkout/order-summary/${Paramcrypt.encode(
          pendingMembership?.id ?? new Date().toDateString()
        )}`,
        permanent: false
      },
      props: { ...props }
    }
  } else if (global?.[2]?.data?.transaction?.status === 1) {
    // setCookie(
    //   'payment',
    //   JSON.stringify({
    //     user_contest_membership_id: pendingBuyPoints?.user_contest_membership_id,
    //     id: pendingBuyPoints?.id,
    //     'points'
    //   })
    // );
    // dispatch(setData(global?.[2]?.data));
    return {
      redirect: {
        destination: `/checkout/order-summary/${Paramcrypt.encode(
          pendingBuyPoints?.id ?? new Date().toDateString()
        )}`,
        permanent: false
      },
      props: { ...props }
    }
  }

  return {
    props: {
      title: 'Checkout | Abracadbara Starquest',
      data,
      global,
      bottomConfig: {
        myPoints: data?.[2] ?? {},
        allEvents: data?.[0] ?? {},
        membershipStatus: membershipStatus ?? {}
      }
    }
  };
};
