import { useEffect, useState } from 'react';
import { RiCloseFill } from 'react-icons/ri';
import { useSelector, useDispatch } from 'react-redux';
import { setEmailOtpChanged, setEmailOtpRegister, setModal } from '../../core/redux/reducers/modalSlice';
import ErrorMessage from '../error/ErrorMessage';
import { useForgotPasswordMutation } from '../../core/services/rtk/AuthenticationServices';
import { authenticationApi } from '../../core/services/rtk/AuthenticationServices';
import { setEmailOtp } from '../../core/redux/reducers/modalSlice';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import useCountDown from 'core/hooks/useCountdown';

export default function ForgotPasswordModal({ onClose }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { modalForgotPassword } = useSelector((state) => state.modal);
  const [email, setEmail] = useState('');
  const [errorEmail, setErrorEmail] = useState('');

  const handleEmail = (e) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (regex.test(e.target.value)) {
      setErrorEmail('');
    } else {
      setErrorEmail('Email is not valid');
    }
    setEmail(e.target.value);
    dispatch(setEmailOtp(e.target.value));
    dispatch(setEmailOtpRegister(null));
    dispatch(setEmailOtpChanged(null));
  };

  const [forgotPassword, { isLoading, isSuccess, isError, error }] = useForgotPasswordMutation();

  useEffect(() => {
    if (isSuccess) {
      dispatch(setModal({ name: 'modalForgotPassword', value: false }));
      dispatch(setModal({ name: 'modalOtp', value: true }));
      dispatch(authenticationApi.util.resetApiState('forgotPassword'));
    }
  }, [isSuccess]);

  const [timer, setTimer] = useState(60);
  const countDown = (data) => {
    let x;
    // 60 seconds from now
    const countDownDate = new Date().getTime() + data * 1000;
    x = setInterval(() => {
      const now = new Date().getTime();
      const distance = countDownDate - now;

      if (distance < 0 || !distance) {
        setTimer(0);
        return () => {
          clearInterval(x);
        };
      } else {
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimer(seconds);
      }
    }, 1000);

    return () => {
      clearInterval(x);
    };
  };

  useEffect(() => {
    if (isError) {
      if (error?.status === 429) {
        countDown(60);
        toast.error(
          `${t('Too many attempts')}, ${t('please try again in')} ${timer} ${t('seconds')}`
        );
      }
      if (error?.message?.includes('user_not_found')) {
        setErrorEmail('Email not found');
      }
    }
  }, [isError]);

  return (
    <>
      <div className={`${modalForgotPassword ? '' : 'hidden'} flex items-center justify-center`}>
        <div className="bg-black/20 fixed inset-0 w-full z-50 flex items-center md:justify-center">
          <div className="bg-[#2B1462] text-slate-50 rounded-r-2xl md:rounded-2xl px-8 md:px-8 pt-8 pb-12 flex flex-col animate-l-to-r w-[92%] md:max-w-md">
            <div className="flex justify-end">
              <RiCloseFill
                size={32}
                onClick={() => dispatch(setModal({ name: 'modalForgotPassword', value: false }))}
                className="cursor-pointer"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <h3 className="text-2xl leading-6 mb-4 font-bold">{t('Forgot Password')}</h3>
              <span className="text-xs md:text-sm font-medium">
                {t('Enter the email address you used when you joined and we’ll send you instruction to reset your password.')}
              </span>
            </div>
            <form>
              <div className="mt-4 flex flex-col space-y-5">
                <div className="flex flex-col space-y-3">
                  <span className="text-sm">Email</span>
                  <input
                    type="email"
                    className="text-sm bg-white px-4 py-3 text-zinc-900 rounded-md focus:outline-none"
                    placeholder={t('Enter email')}
                    value={email}
                    onChange={(e) => handleEmail(e)}
                  />
                  <ErrorMessage message={t(errorEmail)} />
                </div>
                <div className="">
                  <button
                    type="button"
                    className={`
                    ${errorEmail ? 'cursor-not-allowed' : 'cursor-pointer'}
                    px-5 py-2 text-[#4100FF] bg-[#23FF2C] rounded-md font-bold text-base w-full
                  `}
                    onClick={() => forgotPassword({ email })}
                  >
                    {isLoading ? 'Loading...' : `${t('Confirm')}`}
                  </button>
                </div>
                <div className="">
                  <button
                    type="button"
                    onClick={() => {
                      dispatch(setModal({ name: 'modalForgotPassword', value: false }));
                      dispatch(setModal({ name: 'modalLogin', value: true }));
                    }}
                  >
                    <span className="text-[#23FF2C] mx-1 hover:underline">{t('Login')}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
