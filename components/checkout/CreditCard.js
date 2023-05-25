import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  setData,
  setIsUsingCC,
  setPaymentMethodsId,
  setTokenId
} from '../../core/redux/reducers/paymentsSlice';
import { useGetCCTokenMutation } from '../../core/services/rtk/EventServices';
import ErrorMessage from '../error/ErrorMessage';
import Image from 'next/image';

export default function CreditCard({ onClose, paymentMethods }) {
  const dispatch = useDispatch();
  const [cardType, setCardType] = useState('');
  const { t } = useTranslation();
  const [paymentMethodId, setPaymentMethodId] = useState(null);
  const { isUsingCC } = useSelector((state) => state.payments);
  const [inputsCC, setInputsCC] = useState({
    card_number: '',
    card_cvv: '',
    card_exp_month: '',
    card_exp_year: ''
  });
  const [errorsCC, setErrorsCC] = useState({
    card_number: '',
    card_cvv: '',
    card_exp_month: '',
    card_exp_year: ''
  });

  const creditCard = [];
  const [agreeStatus, setAgreeStatus] = useState(false);

  // card number formatter
  const cardNumberFormatter = (value) => {
    const cardNumber = value.replace(/\s/g, '');
    const cardNumberLength = cardNumber.length;
    let cardNumberFormatted = '';
    if (cardNumberLength > 0) {
      cardNumberFormatted = cardNumber.substring(0, 4);
    }
    if (cardNumberLength > 4) {
      cardNumberFormatted += ' ' + cardNumber.substring(4, 8);
    }
    if (cardNumberLength > 8) {
      cardNumberFormatted += ' ' + cardNumber.substring(8, 12);
    }
    if (cardNumberLength > 12) {
      cardNumberFormatted += ' ' + cardNumber.substring(12, 16);
    }
    return cardNumberFormatted;
  };

  // on change input, validate input
  const handleChangeCC = (e) => {
    const { name, value } = e.target;
    // regex number and space
    const regex = /^[0-9\s]*$/;

    if (name === 'card_number') {
      if (value.startsWith('4')) {
        setCardType('cc_visa');
      } else if (value.startsWith('5')) {
        setCardType('cc_mastercard');
      } else if (value.startsWith('3')) {
        setCardType('cc_jcb');
      } else if (value.startsWith('6')) {
        setCardType('cc_american_express');
      } else {
        setCardType('');
      }

      if (!regex.test(value)) {
        return;
      }

      if (value.length < 19) {
        setErrorsCC({
          ...errorsCC,
          card_number: 'Card number must be 16 digits'
        });
      } else if (value.length === 19) {
        setErrorsCC({
          ...errorsCC,
          card_number: ''
        });
      } else {
        return;
      }
    }

    if (name === 'card_cvv') {
      if (value.length < 3) {
        setErrorsCC({
          ...errorsCC,
          card_cvv: 'CVV must be at least 3 digits'
        });
      } else {
        setErrorsCC({
          ...errorsCC,
          card_cvv: ''
        });
      }
      if (value.length > 4) {
        return;
      }
    }

    if (name === 'card_exp_month' || name === 'card_exp_year') {
      if (value.length > 2) {
        return;
      }
      if (name === 'card_exp_month') {
        if (value > 12) {
          return;
        }
      }
    }

    // must a number
    if (name === 'card_cvv' || name === 'card_exp_month' || name === 'card_exp_year') {
      if (isNaN(value) || value === ' ') {
        return;
      }
    }

    if (value === '') {
      setErrorsCC({
        ...errorsCC,
        [name]: ''
      });
    }
    if (!isUsingCC) {
      dispatch(setIsUsingCC(true));
    }

    if (agreeStatus) {
      setAgreeStatus(false);
    }
    setInputsCC({
      ...inputsCC,
      [name]: value
    });
  };

  const [
    getToken,
    {
      data: token,
      error: errorToken,
      refetch: refetchToken,
      isSuccess: isSuccessToken,
      isLoading: loadingGetToken
    }
  ] = useGetCCTokenMutation();

  useEffect(() => {
    if (isSuccessToken) {
      // get payment id
      if (token?.status_code === '200') {
        const paymentId = paymentMethods.find((item) => item.payment_code === cardType).id;
        dispatch(setPaymentMethodsId(paymentId));
        const resData = {
          token_id: token.token_id,
        }
        dispatch(setTokenId(resData));
        dispatch(setData(token));
        setAgreeStatus(true);
      } else {
        toast.error(t(token?.validation_messages?.[0] ?? token?.status_message));
        setAgreeStatus(false);
      }
    }
  }, [isSuccessToken]);

  const onAgree = () => {
    let allow = true;
    if (
      inputsCC.card_number === '' ||
      inputsCC.card_cvv === '' ||
      inputsCC.card_exp_month === '' ||
      inputsCC.card_exp_year === '' ||
      errorsCC.card_number !== '' ||
      errorsCC.card_cvv !== '' ||
      errorsCC.card_exp_month !== '' ||
      errorsCC.card_exp_year !== ''
    ) {
      toast.error(t('Please check/fill your inputs'));
      allow = false;
    }

    if (allow) {
      setAgreeStatus(!agreeStatus);
    }
  };

  useEffect(() => {
    if (agreeStatus) {
      getToken({
        card_number: inputsCC.card_number,
        card_cvv: inputsCC.card_cvv,
        card_exp_month: inputsCC.card_exp_month,
        card_exp_year: inputsCC.card_exp_year
      });
    }
    if (!agreeStatus) {
      dispatch(setIsUsingCC(false));
      dispatch(setTokenId(''));
    }
  }, [agreeStatus]);

  return (
    <div className="flex flex-col space-y-8">
      <div className="flex flex-col space-y-5">
        <h3 className="text-base font-bold">{t('Credit Card')}</h3>
        <form>
          <h6 className="mb-3 text-sm font-medium">{t('Payment Information')}</h6>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 grid-rows-1"></div>
          <div className="grid md:space-x-4 space-y-4 md:space-y-0 grid-cols-1 sm:grid-cols-2 grid-rows-1 mt-3">
            <div className="form-group">
              <div className="flex justify-between">
                <label htmlFor="card_number" className="block mb-1 text-xs font-normal">
                  {t('Credit Card Number')}
                </label>
                <div className="flex justify-between gap-1">
                  {cardType === 'cc_visa' && (
                    <img
                      src={
                        paymentMethods
                          ?.filter((cc) => cc.payment_type === 'credit_card')
                          .find((cc) => cc.payment_name === 'Visa').payment_image
                      }
                      alt="Visa"
                      className="h-5 bg-white rounded-sm mb-2"
                      loading="lazy"
                    />
                  )}
                  {cardType === 'cc_mastercard' && (
                    <img
                      src={
                        paymentMethods
                          ?.filter((cc) => cc.payment_type === 'credit_card')
                          .find((cc) => cc.payment_name === 'Master Card').payment_image
                      }
                      alt="mastercard"
                      className="h-5 bg-white rounded-sm mb-2"
                      loading="lazy"
                    />
                  )}
                  {cardType === 'cc_jcb' && (
                    <img
                      src={
                        paymentMethods
                          ?.filter((cc) => cc.payment_type === 'credit_card')
                          .find((cc) => cc.payment_name === 'JCB').payment_image
                      }
                      alt="jcb"
                      className="h-5 bg-white rounded-sm mb-2"
                      loading="lazy"
                    />
                  )}
                  {cardType === 'cc_american_express' && (
                    <img
                      src={
                        paymentMethods
                          ?.filter((cc) => cc.payment_type === 'credit_card')
                          .find((cc) => cc.payment_name === 'American Express').payment_image
                      }
                      alt="amex"
                      className="h-5 bg-white rounded-sm mb-2"
                      loading="lazy"
                    />
                  )}
                  {cardType === '' &&
                    paymentMethods
                      ?.filter((cc) => cc.payment_type === 'credit_card')
                      .map((item, index) => (
                        <img
                          key={index}
                          src={item.payment_image}
                          alt={item.payment_name}
                          className="h-5 bg-white rounded-sm mb-2"
                          loading="lazy"
                        />
                      ))}
                </div>
              </div>
              <input
                type="text"
                id="card_number"
                className="text-sm text-zinc-900 rounded-sm w-full py-1.5 px-2 outline-none"
                name="card_number"
                value={cardNumberFormatter(inputsCC.card_number)}
                onChange={(e) => handleChangeCC(e)}
              />
              <ErrorMessage message={errorsCC.card_number} />
            </div>
            <div className="form-group">
              <label htmlFor="card_cvv" className="block mb-1 text-xs font-normal">
                CVV
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="card_cvv"
                  className="text-sm text-zinc-900 rounded-sm w-full py-1.5 px-2 outline-none"
                  name="card_cvv"
                  value={inputsCC.card_cvv}
                  onChange={(e) => handleChangeCC(e)}
                />
                <ErrorMessage message={errorsCC.card_cvv} />
                <button
                  type="button"
                  className="absolute z-10 cursor-pointer h-full right-4 top-0 flex items-center"
                  // onClick={() => setVisiblePass(!visiblePass)}
                >
                  {/* {visiblePass ? <BsEye size={16} className="text-gray-600" /> : <BsEyeSlash size={16} className="text-gray-600" />} */}
                </button>
              </div>
            </div>
          </div>
          <div className="grid md:space-x-4 space-y-4 md:space-y-0 grid-cols-1 sm:grid-cols-2 grid-rows-1 mt-3">
            <div className="form-group">
              <label htmlFor="card_number" className="block mb-1 text-xs font-normal">
                {t('Expired Month')}
              </label>
              <input
                type="text"
                id="card_exp_month"
                className="text-sm text-zinc-900 rounded-sm w-full py-1.5 px-2 outline-none"
                name="card_exp_month"
                value={inputsCC.card_exp_month}
                onChange={(e) => handleChangeCC(e)}
              />
              <ErrorMessage message={errorsCC.card_exp_month} />
            </div>
            <div className="form-group">
              <label htmlFor="card_exp_year" className="block mb-1 text-xs font-normal">
                {t('Expired Year')}
              </label>
              <input
                type="text"
                id="card_exp_year"
                className="text-sm text-zinc-900 rounded-sm w-full py-1.5 px-2 outline-none"
                name="card_exp_year"
                value={inputsCC.card_exp_year}
                onChange={(e) => handleChangeCC(e)}
              />
              <ErrorMessage message={errorsCC.card_exp_year} />
            </div>
          </div>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 grid-rows-1 mt-3">
            <div className="form-group">
              <label htmlFor="agree" className="mb-1 text-xs font-normal gap-2 flex items-center">
                {' '}
                <input
                  type="checkbox"
                  id="agree"
                  checked={agreeStatus && isUsingCC}
                  onChange={onAgree}
                />
                {loadingGetToken ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-t-2 border-b-2 border-gray-600 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  `${t('I hereby agree to pay')}`
                )}
              </label>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
