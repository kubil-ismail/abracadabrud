import React from 'react';
import { useState } from 'react';
import { RiCloseFill } from 'react-icons/ri';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import {
  setModal,
  setEmailOtpChanged,
  setEmailOtpRegister,
  setEmailOtp
} from '../../core/redux/reducers/modalSlice';
import service from 'core/services/publicService';
import { useTranslation } from 'react-i18next';
import { decrypt, encrypt } from 'lib/Aes.v2';
import { toast } from 'react-toastify';
import useCountDown from 'core/hooks/useCountdown';

export default function LoginModal({ onClose }) {
  const [seePassword, setSeePassword] = useState(false);
  const [email, setEmail] = useState('');
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [errorEmail, setErrorEmail] = useState('');
  const [errorPass, setErrorPass] = useState('');

  const { token } = useSelector((state) => state.authentication);
  const { modalChangeEmail } = useSelector((state) => state.modal);

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

  const sendOtp = () => {
    setIsLoading(true);
    setErrorPass('');
    setErrorEmail('');

    service
      .post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/me/profile/change-email`, {
        payload: encrypt({
          new_email: email,
          password
        })
      })
      .then(() => {
        dispatch(setEmailOtp(null));
        dispatch(setEmailOtpRegister(null));
        dispatch(setEmailOtpChanged({ email, password }));
        dispatch(setModal({ name: 'modalChangeEmail', value: false }));
        dispatch(setModal({ name: 'modalOtp', value: true }));
      })
      .catch((error) => {
        const response = decrypt(error?.response?.data?.result);

        if (response?.status === 429) {
          countDown(60)
          toast.error(`${t('Too many attempts')}, ${t('please try again in')} ${timer} ${t('seconds')}`);
        }

        if (response?.message === 'api.auth.login.password_invalid') {
          setErrorPass('Invalid password');
        }

        if (response?.message === 'api.auth.login.email_exists') {
          setErrorEmail('Email already exists');
        }

        if (response?.errors?.password?.length > 0) {
          setErrorPass(response?.errors?.password[0]);
        }

        if (response?.errors?.new_email?.length > 0) {
          setErrorEmail(response?.errors?.new_email[0]);
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className={`${modalChangeEmail ? '' : 'hidden'}`}>
      <div className="flex items-center justify-center">
        <div className="bg-black/20 fixed inset-0 w-full z-50 flex items-center md:justify-center">
          <div className="bg-[#2B1462] text-slate-50 rounded-r-2xl md:rounded-2xl px-6 md:px-8 pt-8 pb-12 flex flex-col animate-l-to-r w-[92%] md:max-w-md">
            <div className="flex justify-end">
              <RiCloseFill
                size={32}
                onClick={() => dispatch(setModal({ name: 'modalChangeEmail', value: false }))}
                className="cursor-pointer mb-4"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <h3 className="text-2xl leading-6 mb-2 font-bold">{t('Change Email')}</h3>
              {/* <span className="text-xs md:text-sm font-medium">Enter the email address you used when you joined and we’ll send you instruction to reset your password</span> */}
            </div>
            <form>
              <div className="mt-4 flex flex-col space-y-4">
                <div className="flex flex-col space-y-3">
                  <span className="text-sm">{t('New Email')}</span>
                  <input
                    type="text"
                    className="text-sm bg-white px-4 py-3 text-zinc-900 rounded-md focus:outline-none"
                    placeholder={t('Enter new email')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errorEmail && <span className="text-red-500 text-xs">{t(errorEmail)}</span>}
                </div>
                <div className="flex flex-col space-y-3">
                  <span className="text-sm">{t('Current Password')}</span>
                  <div className="relative">
                    <input
                      type={seePassword ? 'text' : 'password'}
                      className="text-sm bg-white px-4 py-3 text-zinc-900 rounded-md w-full focus:outline-none"
                      placeholder={t('Enter current password')}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute z-10 cursor-pointer h-full right-4 top-0 flex items-center"
                      onClick={() => setSeePassword(!seePassword)}>
                      {seePassword ? (
                        <BsEye size={16} className="text-gray-600" />
                      ) : (
                        <BsEyeSlash size={16} className="text-gray-600" />
                      )}
                    </button>
                  </div>
                  {errorPass && <span className="text-red-500 text-xs">{t(errorPass)}</span>}
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="w-32 px-5 py-2 text-[#4100FF] bg-[#23FF2C] font-bold rounded-md text-base"
                    onClick={() => sendOtp()}>
                    {isLoading ? 'Loading...' : `${t('Submit')}`}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
