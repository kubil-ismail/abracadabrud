import Link from 'next/link';
import RunningText from './RunningText';
import { useRouter } from 'next/router';
import BottomSheetsMyPoint from '../bottom-sheets/BottomSheetsMyPoint';
import BottomSheetsCast from '../bottom-sheets/BottomSheetsCast';
import { useSelector, useDispatch } from 'react-redux';
import { setModal } from '../../core/redux/reducers/modalSlice';
import { useEffect, useState } from 'react';
import { eventApi } from 'core/services/rtk/EventServices';
import Paramcrypt from 'lib/Paramcrypt';
import { setData, setEventId, setEvents, setPaymentFor } from 'core/redux/reducers/paymentsSlice';
import { pointApi } from 'core/services/rtk/MeServices';
import { useTranslation } from 'react-i18next';
import DisableEventModal from 'components/navbar/DisableEventModal';
import { toast } from 'react-toastify';
import { logout } from 'core/redux/reducers/authenticationSlice';
import { setCookie } from 'cookies-next';
import SSServices from 'core/services/ServerSide/ssServices';

export default function MenuBar(props) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [disableEvent, setDisableEvent] = useState(false);
  const [loadingVideoUpload, setLoadingVideoUpload] = useState(false);
  const { t } = useTranslation();
  const { event_id, payment_for } = useSelector((state) => state.payments);
  const { memberships } = useSelector((state) => state.memberships);
  const { required_to_enroll } = useSelector((state) => state.global);
  const { isAuthenticated, token, user } = useSelector((state) => state.authentication);
  const events = props?.allEvents;
  const dataMembershipStatus = props?.membershipStatus;

  console.log('events', events);

  useEffect(() => {
    if (events?.data?.data?.[0]) {
      dispatch(setEvents(events?.data?.data[0]));
      dispatch(setEventId(events?.data?.data[0]?.id));
    }
    if (events?.data?.data.length === 0 && events?.last_event) {
      // dispatch(setEvents(events?.last_event));
      dispatch(setEventId(events?.last_event?.id));
    }
  }, [events]);

  useEffect(() => {
    if (router.pathname === '/uploads') {
      if (!isAuthenticated || !token) {
        router.push('/');
        dispatch(setModal({ name: 'modalLogin', value: true }));
      }
    }
  }, [router.pathname]);

  const checkCanUpload = () => {
    setLoadingVideoUpload(true);

    SSServices.canUpload({ token, eventId: events?.data?.data[0]?.id })
      .then((result) => {
        if (!result?.status) {
          if (result?.data?.status === 'pending') {
            SSServices.getPaymentsVideo({ token, id: user?.id, client: true })
              .then((nested) => {
                // check pending payment
                const pending = nested?.data?.find((_result) => _result?.status === 1);

                setCookie(
                  'payment',
                  JSON.stringify({
                    ...{ video_id: pending?.video_id, id: pending?.id },
                    ...{ payment_for: 'video_upload' }
                  })
                );
                dispatch(setData(pending));
                dispatch(setPaymentFor('video_upload'));

                router.push(
                  `/checkout/order-summary/${Paramcrypt.encode(result?.data?.video_payment_id ?? new Date().toDateString())}`
                );
              })
              .catch(() => {
                dispatch(setModal({ name: 'modalContinuePay', value: true }));
              }).finally(() => {
                setLoadingVideoUpload(false);
              })
          } else {
            setLoadingVideoUpload(false);
            dispatch(setModal({ name: 'modalContinuePay', value: true }));
          }
        } else {
          setLoadingVideoUpload(false);
          router.push('/uploads');
        }
      })
      .catch(() => {
        setLoadingVideoUpload(false);
        toast.error("Can't upload video because no available event right now");
      })
  };

  useEffect(() => {
    if (required_to_enroll === true) {
      if (isAuthenticated) {
        dispatch(logout());
        dispatch(pointApi.util.resetApiState());
        toast.success(t('You have been enrolled to the new event, please login again'));
      }
    }
  }, [required_to_enroll]);

  // useEffect(() => {
  //   dispatch(eventApi.util.invalidateTags(['ActiveMemberships']));
  // }, []);

  return (
    <div className="w-full flex items-center justify-center bg-[#363636] fixed bottom-0 left-0 right-0 z-30">
      <div className="w-full z-30 max-w-[440px]">
        <div className="flex flex-col">
          <RunningText />
          <div className="p-3 grid grid-cols-5 gap-2 text-slate-50 w-full">
            <Link href="/">
              <div className="flex flex-col gap-1 items-center text-slate-50">
                {router.pathname === '/' ? (
                  <img
                    src="/assets/icons/home-icon-active.svg"
                    alt="home-icon-active"
                    loading="lazy"
                    width="32px"
                    height="32px"
                  />
                ) : (
                  <img
                    src="/assets/icons/home-icon.svg"
                    alt="home-icon"
                    loading="lazy"
                    width="32px"
                    height="32px"
                  />
                )}
                <span className="text-[10px] font-light">{t('Home')}</span>
              </div>
            </Link>
            <button
              className="flex flex-col gap-1 text-center items-center text-slate-50"
              onClick={() => {
                if (!isAuthenticated || !token) {
                  dispatch(setModal({ name: 'modalLogin', value: true }));
                  return;
                } else {
                  if (events?.data?.data.length > 0) {
                    checkCanUpload();
                  } else {
                    setDisableEvent(true);
                  }
                }
              }}
              disabled={loadingVideoUpload}>
              {router.pathname === '/uploads' ||
                (payment_for === 'video_upload' &&
                  router.pathname.startsWith('/checkout/order-summary')) ? (
                <img
                  src="/assets/icons/upload-icon-active.svg"
                  alt="upload-icon-active"
                  loading="lazy"
                  width="32px"
                  height="32px"
                />
              ) : (
                <img
                  src="/assets/icons/upload-icon.svg"
                  alt="upload-icon"
                  loading="lazy"
                  width="32px"
                  height="32px"
                />
              )}
              <span className="text-[10px] font-light">
                {loadingVideoUpload ? 'Loading...' : `${t('Upload Video')}`}
              </span>
            </button>
            {isAuthenticated &&
              (memberships?.length > 0 || dataMembershipStatus?.memberships?.length) ? (
              <Link href="/premium-access">
                <div className="flex flex-col gap-1 items-center text-slate-50">
                  <img
                    src="/assets/icons/verified.png"
                    alt="upgrade-icon-active"
                    loading="lazy"
                    width="32px"
                    height="32px"
                  />
                  <span className="text-[10px] font-light text-center">{t('Premium Access')}</span>
                </div>
              </Link>
            ) : (
              <Link href="/faq/#memberships">
                <div className="flex flex-col gap-1 items-center text-slate-50">
                  {router.pathname.startsWith('/faq') ||
                    (payment_for === 'membership' &&
                      router.pathname.startsWith('/checkout/order-summary')) ? (
                    <img
                      src="/assets/icons/upgrade-icon-active.svg"
                      alt="upgrade-icon-active"
                      loading="lazy"
                      width="32px"
                      height="32px"
                    />
                  ) : (
                    <img
                      src="/assets/icons/upgrade-icon.svg"
                      alt="upgrade-icon"
                      loading="lazy"
                      width="32px"
                      height="32px"
                    />
                  )}
                  <span className="text-[10px] font-light">{t('Upgrade')}</span>
                </div>
              </Link>
            )}

            <BottomSheetsCast {...props} />
            <BottomSheetsMyPoint {...props} />

            {disableEvent && <DisableEventModal onClose={() => setDisableEvent(false)} />}
          </div>
        </div>
      </div>
    </div>
  );
}
