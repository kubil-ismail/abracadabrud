import { useSelector, useDispatch } from 'react-redux';
import { setIsUsingCC, setPaymentMethodsId, setPaymentQris } from 'core/redux/reducers/paymentsSlice';
import { useTranslation } from 'react-i18next';

export default function Ewallet({ paymentMethods, isPhone }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { paymentMethodsId, isUsingCC, isQris } = useSelector((state) => state.payments);

  return (
    <div className="flex flex-col space-y-5 pb-2">
      <h3 className="text-base font-bold">{t('E-Wallet')}</h3>
      <div className="flex flex-wrap gap-2 md:gap-5 justify-center">
        {paymentMethods
          ?.filter((item) => item.payment_type === 'ewallet')
          ?.filter((item) =>
            item?.payment_code === 'ewallet_shopeepay' && isPhone
              ? item
              : item?.payment_code !== 'ewallet_shopeepay'
              ? item
              : null
          )
          .map((data) => (
            <button
              className={`${
                paymentMethodsId === data.id && !isQris && !isUsingCC
                  ? 'bg-gray-300'
                  : 'bg-white cursor-pointer'
              } rounded-md p-3 w-[38%] md:w-[18%]`}
              key={data.id}
              onClick={() => {
                dispatch(setPaymentMethodsId(data.id));
                dispatch(setPaymentQris(false));
                if (isUsingCC) {
                  dispatch(setIsUsingCC(false));
                }
              }}>
              <img
                src={data.payment_image}
                alt="logo"
                height={8}
                loading="lazy"
                className="w-16 h-6 m-auto"
                style={{ objectFit: 'contain' }}
              />
            </button>
          ))}

        {paymentMethods
          ?.filter((items) => items?.payment_type === 'ewallet')
          .map((data) =>
            data?.payment_code === 'ewallet_gopay' ? (
              <button
                className={`${
                  paymentMethodsId === data?.id && isQris && !isUsingCC
                    ? 'bg-gray-300'
                    : 'bg-white cursor-pointer'
                } rounded-md p-3 w-[38%] md:w-[18%]`}
                key={data?.id}
                onClick={() => {
                  dispatch(setPaymentMethodsId(data?.id));
                  dispatch(setPaymentQris(true));
                  if (isUsingCC) {
                    dispatch(setIsUsingCC(false));
                  }
                }}>
                <img
                  src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/qris.png`}
                  alt="logo"
                  height={8}
                  loading="lazy"
                  className="w-16 h-4 m-auto"
                  style={{ objectFit: 'contain' }}
                />
              </button>
            ) : null
          )}
        {/* {paymentMethods
          ?.filter((item) => item.payment_type === 'ewallet')?.filter(
            (data) => (isMobileDevice() ? true : data?.payment_name !== 'ShopeePay'),
          ).map((data) => (
            <button
              className={`${
                paymentMethodsId === data.id && !isUsingCC
                  ? 'bg-gray-300'
                  : 'bg-white cursor-pointer'
              } rounded-md p-3 w-[38%] md:w-[18%]`}
              key={data.id}
              onClick={() => {
                dispatch(setPaymentMethodsId(data.id));
                if (isUsingCC) {
                  dispatch(setIsUsingCC(false));
                }
              }}
            >
              <img src={data.payment_image} alt="logo" className="w-12 m-auto" />
            </button>
          ))} */}
      </div>
    </div>
  );
}
