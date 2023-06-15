import { useSelector, useDispatch } from 'react-redux';
import {
    setIsUsingCC,
    setPaymentMethodsId,
    setPaymentQris
} from 'core/redux/reducers/paymentsSlice';
import { useTranslation } from 'react-i18next';

export default function CreditCardSnap({ paymentMethods }) {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { paymentMethodsId, isUsingCC } = useSelector((state) => state.payments);
    const payment_id = paymentMethods?.filter((item) => item.payment_type === 'credit_card')[0]?.id || 0;
    return (
        <div className="flex flex-col gap-5">
            <h3 className="text-base font-bold">{t('Credit Card')}</h3>
            <div className="flex flex-wrap gap-5 justify-center">
                <button
                    className={`${paymentMethodsId === payment_id && isUsingCC
                        ? 'bg-gray-300'
                        : 'bg-white cursor-pointer'
                        } rounded-md p-2 h-14 flex items-center justify-center`}
                    onClick={() => {
                        dispatch(setPaymentMethodsId(payment_id));
                        dispatch(setPaymentQris(false));
                        if (!isUsingCC) {
                            dispatch(setIsUsingCC(true));
                        }
                    }}>
                    {paymentMethods
                        ?.filter((item) => item.payment_type === 'credit_card')
                        .map((data) => (
                            <img
                                key={data.id}
                                src={data.payment_image}
                                alt={data.payment_name}
                                alt="logo"
                                className="w-16 h-6 m-auto"
                                style={{ objectFit: 'contain' }}
                                loading="lazy"
                            />
                        ))}
                </button>
            </div>
        </div>
    );
}
