import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { setModal } from 'core/redux/reducers/modalSlice';
import { toast } from 'react-toastify';
import { setPaymentFor, setPointsFee, setPointsId } from 'core/redux/reducers/paymentsSlice';
import { useEffect } from 'react';
import { setCookie } from 'cookies-next';

export default function ExtraPoints(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();

  const { isAuthenticated, token } = useSelector((state) => state.authentication);
  const price = props?.bottomConfig?.allEvents?.buy_points?.price ?? 0;
  const can_buy_points = props?.bottomConfig?.membershipStatus?.can_buy_points ?? false;

  useEffect(() => {
    if (props?.bottomConfig?.allEvents?.buy_points?.price) {
      // dispatch(setPointsId(props?.bottomConfig?.allEvents?.buy_points?.id)); // not used yet?
      dispatch(setPointsFee(price));
    }
  }, [price]);

  const checkoutPoints = () => {
    // harus login
    if (!isAuthenticated || !token) {
      dispatch(setModal({ name: 'modalLogin', value: true }));
      return;
    }

    // harus ada event ongoing
    if (props?.bottomConfig?.allEvents?.data?.data?.length === 0) {
      toast.error(t('There is no event'));
      return;
    }

    // harus sudah membership
    // if (props?.bottomConfig?.membershipStatus?.memberships?.length === 0) {
    //     toast.error(t('Please upgrade your membership first'));
    //     return;
    // }

    // harus belum beli points di minggu ini
    if (!can_buy_points) {
      toast.error(t('You already bought points for this week, please try again next week'));
      return;
    }
    dispatch(setPaymentFor('points'));
    setCookie('payment', JSON.stringify({ payment_for: 'points' }));
    router.push('/checkout');
  };

  return (
    <div
      className="flex flex-col space-y-6 p-5 md:py-16 md:px-12 bg-[#250D54] rounded-[20px]"
      id="extra_points">
      <div className="flex flex-col space-y-4 md:space-y-6 my-6">
        {/* // your membership is active
          <div className="flex flex-col items-center space-y-3 m-auto">
            <div className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-white/80 to-white/40 text-slate-50 shadow-[0px_10px_24px_rgba(255,_255,_255,_0.25)] rounded-full">
              <img src="/assets/icons/verified.png" alt="verified" className="w-5 md:w-6" />
              <span className="text-base md:text-xl font-bold">
                {t('Your Membership is Active')}
              </span>
            </div>
            <p className="text-xs md:text-sm font-normal">
              {t('Your membership is active until')}{' '}
              <span className="text-[#23FF2C] font-bold">
                {moment(memberships[0]?.expiry_date).format('LLL')}
              </span>
            </p>
          </div> */}
        <button
          type="button"
          className={`p-3 bg-[#6CFF00] text-[#0000FF] rounded-[10px] w-full md:max-w-md md:m-auto md:block font-bold text-lg ${process.env.NEXT_PUBLIC_IS_PRELAUNCH && 'btn-disabled-green'
            }`}
          onClick={checkoutPoints}>
          {t('Buy Extra Points Now!')}
        </button>
      </div>
      <div className="flex flex-col items-center text-[#FF00FE] ">
        <h3 className="font-extrabold text-center text-2xl">{t('Shower your favorite')}</h3>
        <h3 className="font-extrabold text-center text-2xl">{t('videos with extra votes!')}</h3>
        <span className="font-semibold text-center text-2xl">{t('Rp 29,900')}</span>
      </div>
      <div className="flex items-center justify-center w-full h-full">
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
      </div>
      <div className="md:mt-5">
        {/* your membership is active
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
          </div> */}
        <button
          type="button"
          onClick={checkoutPoints}
          className={`p-3 bg-[#6CFF00] text-[#0000FF] rounded-[10px] w-full md:max-w-md md:m-auto md:block font-bold text-lg ${process.env.NEXT_PUBLIC_IS_PRELAUNCH && 'btn-disabled-green'
            }`}>
          {t('Buy Extra Points Now!')}
        </button>
      </div>
    </div>
  );
}
