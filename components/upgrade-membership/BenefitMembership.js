import { setModal } from 'core/redux/reducers/modalSlice';
import {
  setMembershipFee,
  setMembershipId,
  setPaymentFor,
  setEvents,
  setContestId,
  setData,
  setEventId
} from 'core/redux/reducers/paymentsSlice';
import { eventApi } from 'core/services/rtk/EventServices';
import { useGetEventMembershipQuery } from 'core/services/rtk/MembershipServices';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { setCookie } from 'cookies-next';

export default function BenefitMembership(props) {
  const memberships = props?.bottomConfig?.membershipStatus?.memberships ?? [];
  const events = props?.bottomConfig?.allEvents ?? [];
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const router = useRouter();

  // ongoing events
  const { isAuthenticated, token } = useSelector((state) => state.authentication);

  useEffect(() => {
    if (events?.data?.data[0]) {
      dispatch(setEvents(events?.data?.data[0]));
      dispatch(setContestId(events?.data?.data[0]?.current_contest?.id));
      dispatch(setEventId(events?.data?.data[0]?.id));
      dispatch(setMembershipFee(events?.data?.data[0]?.memberships[0]?.price));
      dispatch(setMembershipId(events?.data?.data[0]?.memberships[0]?.membership_id));
    }

    if (events?.data?.data.length === 0 && events?.last_event) {
      dispatch(setEvents(events?.last_event));
      dispatch(setContestId(events?.last_event?.event_contest_id));
      dispatch(setMembershipFee(events?.last_event?.membership?.price));
      dispatch(setMembershipId(events?.last_event?.membership?.id));
      dispatch(setEventId(events?.last_event?.id));
    }
  }, [events]);

  const handlePremiumAccess = () => {
    router.push('/premium-access');
  };

  return (
    <div className="flex flex-col space-y-6 p-5 md:py-16 md:px-12 bg-[#250D54] rounded-[20px]">
      <div className="flex flex-col space-y-4 md:space-y-6 my-6">
        {memberships?.length > 0 ? (
          // your membership is active
          <div className="flex flex-col items-center space-y-3 m-auto">
            <div className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-white/80 to-white/40 text-slate-50 shadow-[0px_10px_24px_rgba(255,_255,_255,_0.25)] rounded-full">
              <img src="/assets/icons/verified.png" alt="verified" className="w-5 md:w-6" />
              <span className="text-base md:text-xl font-bold">
                {t('Your Membership is Active')}
              </span>
            </div>
            {/* <p className="text-xs md:text-sm font-normal">
              {t('Your membership is active until')}{' '}
              <span className="text-[#23FF2C] font-bold">
                {moment(memberships[0]?.expiry_date).format('LLL')}
              </span>
            </p> */}
          </div>
        ) : (
          <button
            type="button"
            className={`p-3 bg-[#6CFF00] text-[#0000FF] rounded-[10px] w-full md:max-w-md md:m-auto md:block font-semibold text-lg ${process.env.NEXT_PUBLIC_IS_PRELAUNCH && 'btn-disabled-green'
              }`}
            disabled={process.env.NEXT_PUBLIC_IS_PRELAUNCH}
            onClick={() => {
              if (!process.env.NEXT_PUBLIC_IS_PRELAUNCH) {
                if (!isAuthenticated || !token) {
                  dispatch(setModal({ name: 'modalLogin', value: true }));
                  return;
                }
                console.log('events', props);
                // harus ada event ongoing
                if (!events?.data?.data[0] && !events?.last_event) {
                  toast.error(t('There is no event'));
                  return;
                }

                dispatch(setPaymentFor('membership'));
                setCookie('payment', JSON.stringify({
                  payment_for: 'membership',
                  event_id: events?.data?.data[0]?.id || events?.last_event?.id,
                }));
                router.push('/checkout');
              }
            }}>
            {t('Upgrade Membership Now!')}
          </button>
        )}
      </div>
      <div className="flex items-center justify-center w-full">
        <img
          src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/verified.png`}
          alt="verified"
          className="w-12"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col items-center text-[#FF00FE] ">
        <h3 className="font-extrabold text-2xl">{t('Premium')}</h3>
        <h3 className="font-extrabold text-2xl">{t('Membership')}</h3>
        <span className="font-semibold text-2xl">{t('Rp 29,900 /week')}</span>
      </div>
      <h3 className="font-semibold text-slate-50 text-center md:w-1/2 md:m-auto md:inline-block">
        {t(
          'Join us backstage at wePOP! Upgrade your profile to a Premium Membership and enjoy premium backstage access online with us live from the wePOP concert on August 6th. For more info'
        )}{' '}
        <button type="button" onClick={handlePremiumAccess} className="underline">
          {t('click here.')}
        </button>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 space-y-5 md:my-4 md:items-center">
        <div className="flex flex-col space-y-3 items-center text-center">
          <img
            src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/content-exclusive.png`}
            alt=""
            className="w-48 md:w-64"
          />
          <h3 className="font-extrabold text-2xl text-[#FF00FE]">
            {t('Receive exclusive backstage content')}
          </h3>
          <span className="font-semibold text-base text-[#23FF2C] w-3/4">
            {t(
              'Get exclusive access to photos and videos backstage as performers rehearse and prepare for the big event.'
            )}
          </span>
        </div>
        <div className="flex flex-col space-y-3 items-center text-center">
          <img
            src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/investor-lp.webp`}
            alt=""
            className="w-48 md:w-64"
          />
          <h3 className="font-extrabold text-2xl text-[#FF00FE]">
            {t('Exciting gifts from wePOP sponsors')}
          </h3>
          <span className="font-semibold text-base text-[#23FF2C] w-3/4">
            {t('Get exclusive premium member prizes and gifts from wePOP sponsors.')}
          </span>
        </div>
        <div className="flex flex-col space-y-3 items-center text-center">
          <img
            src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/more-chances.png`}
            alt=""
            className="w-48 md:w-64"
          />
          <h3 className="font-extrabold text-2xl text-[#FF00FE] w-3/4 opacity-50">
            {t('500 points')}
          </h3>
          <span className="font-semibold text-base text-[#23FF2C] w-3/4 opacity-50">
            {t('Get 500 free points when you upgrade your membership.')}
          </span>
        </div>
        <div className="flex flex-col space-y-3 items-center text-center">
          <img
            src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/eksklusif-ld.png`}
            alt=""
            className="w-48 md:w-64"
          />
          <h3 className="font-extrabold text-2xl text-[#FF00FE] w-3/4">
            {t('More chances to win')}
          </h3>
          <span className="font-semibold text-base text-[#23FF2C] w-3/4">
            {t('Each task you complete as a premium member will earn you double points.')}
          </span>
        </div>
      </div>
      <div className="md:mt-5">
        {memberships?.length > 0 ? (
          // your membership is active
          <div className="flex items-center justify-center m-auto">
            <div className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-white/80 to-white/40 text-slate-50 shadow-[0px_10px_24px_rgba(255,_255,_255,_0.25)] rounded-full">
              <img
                src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/verified.png`}
                alt="verified"
                className="w-5 md:w-6"
              />
              <span className="text-base md:text-xl font-bold">
                {t('Your Membership is Active')}
              </span>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className={`p-3 bg-[#6CFF00] text-[#0000FF] rounded-[10px] w-full md:max-w-md md:m-auto md:block font-semibold text-lg ${process.env.NEXT_PUBLIC_IS_PRELAUNCH && 'btn-disabled-green'
              }`}
            disabled={!events || process.env.NEXT_PUBLIC_IS_PRELAUNCH}
            onClick={() => {
              if (!process.env.NEXT_PUBLIC_IS_PRELAUNCH) {
                if (!isAuthenticated || !token) {
                  dispatch(setModal({ name: 'modalLogin', value: true }));
                  return;
                }

                // harus ada event ongoing
                if (!events?.data?.data[0] && !events?.last_event) {
                  toast.error(t('There is no event'));
                  return;
                }

                dispatch(setPaymentFor('membership'));
                setCookie('payment', JSON.stringify({
                  payment_for: 'membership',
                  event_id: events?.data?.data[0]?.id || events?.last_event?.id,
                }));
                router.push('/checkout');
              }
            }}>
            {t('Upgrade Membership Now!')}
          </button>
        )}
      </div>
    </div>
  );
}
