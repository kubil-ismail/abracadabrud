import { useSelector, useDispatch } from 'react-redux';
import {
  setIsUsingCC,
  setPaymentMethodsId,
  setPaymentQris
} from 'core/redux/reducers/paymentsSlice';
import { useTranslation } from 'react-i18next';

export default function VirtualAccount({ paymentMethods }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { paymentMethodsId, isUsingCC } = useSelector((state) => state.payments);

  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-base font-bold">{t('Bank Transfer')}</h3>
      <div className="flex flex-wrap space-x-2 md:space-x-5 justify-center pb-2">
        {paymentMethods
          ?.filter(
            (item) => item.payment_type === 'virtual_account'
          )
          .map((data) => (
            <button
              className={`${
                paymentMethodsId === data.id && !isUsingCC
                  ? 'bg-gray-300 mb-3'
                  : 'bg-white cursor-pointer'
              } rounded-md p-3 w-[38%] md:w-[18%] mb-3`}
              key={data.id}
              onClick={() => {
                dispatch(setPaymentMethodsId(data.id));
                dispatch(setPaymentQris(false));
                if (isUsingCC) {
                  dispatch(setIsUsingCC(false));
                }
              }}>
              <img src={data.payment_image} alt="logo" className="w-12 m-auto" loading="lazy" />
            </button>
          ))}
      </div>
    </div>
  );
}
