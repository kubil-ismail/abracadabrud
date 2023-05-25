import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { RiCloseFill } from 'react-icons/ri';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../../core/services/rtk/AuthenticationServices';
import { setCredentials, setIsAuthenticated } from '../../core/redux/reducers/authenticationSlice';
import { setModal } from '../../core/redux/reducers/modalSlice';
import { authenticationApi } from '../../core/services/rtk/AuthenticationServices';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { setCookie } from 'cookies-next';
import ReCAPTCHA from 'react-google-recaptcha';

export default function LoginModal({ onClose }) {
  const recaptchaRef = useRef();
  const [seePassword, setSeePassword] = useState(false);
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errCount, setErrCount] = useState(0);
  const router = useRouter();
  const { push } = useRouter();
  const dispatch = useDispatch();
  const [validCaptcha, setValidCaptcha] = useState(false);

  const [login, { data, isLoading, isError, isSuccess, error }] = useLoginMutation();

  // useLoadingBar(isLoading);

  const { token, isAuthenticated, dataRegister } = useSelector((state) => state.authentication);

  const { modalLogin } = useSelector((state) => state.modal);

  const changeLang = (lang, lang2) => {
    if (data?.user?.pref_language === '1') {
      push(lang, lang, { locale: 'id' });
    } else {
      push(lang2, lang2, { locale: 'en' });
    }
  };

  useEffect(() => {
    if (modalLogin) {
      if (token && isAuthenticated) {
        setIsOpen(false);
        dispatch(setModal({ name: 'modalLogin', value: false }));
        // push('/');
      }
      if (isSuccess) {
        if (data?.token) {
          dispatch(setCredentials(data));
          dispatch(setIsAuthenticated(true));
          dispatch(authenticationApi.util.resetApiState('login'));
          setModal({ name: 'modalLogin', value: false });
          setCookie('_userId', data?.user?.id);
          setCookie('_token', data?.token);

          if (!router.pathname.includes('/video')) {
            changeLang('/', '/en');
          } else {
            changeLang(router.asPath, router.asPath);
          }
          toast.success(t('Success Login'));
        }
      }
    }
  }, [isSuccess]);

  useEffect(() => {
    if (dataRegister) {
      setEmail(dataRegister?.username);
      setPassword(dataRegister?.password);
    }
  }, [dataRegister]);

  const handleSignUp = () => {
    if (!isAuthenticated) {
      dispatch(setModal({ name: 'modalRegister', value: true }));
      dispatch(setModal({ name: 'modalLogin', value: false }));
    }
  };

  useEffect(() => {
    if (modalLogin) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  });

  useEffect(() => {
    if (isError) {
      setErrCount(errCount + 1);
    }
  }, [isError]);

  return (
    <div className={`${modalLogin && !isAuthenticated ? '' : 'hidden'}`}>
      <div className="flex items-center justify-center">
        <div className="bg-black/20 fixed inset-0 w-full z-50 flex items-center md:justify-center">
          <div className="bg-[#2B1462] text-slate-50 rounded-r-2xl md:rounded-2xl px-6 md:px-8 pt-8 pb-12 flex flex-col animate-l-to-r w-[92%] md:max-w-md">
            <div className="flex justify-end">
              <RiCloseFill
                size={32}
                onClick={() => dispatch(setModal({ name: 'modalLogin', value: false }))}
                className="cursor-pointer mb-4"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <h3 className="text-xl md:text-2xl leading-4 mb-2 font-bold">
                {t('Please login to upload a video, vote, collect points, and win amazing prizes!')}
              </h3>
              {/* <span className="text-xs md:text-sm font-medium">Enter the email address you used when you joined and we’ll send you instruction to reset your password</span> */}
            </div>
            <form>
              <div className="mt-4 flex flex-col space-y-4">
                <div className="flex flex-col space-y-3">
                  <span className="text-sm">{t('Account')}</span>
                  <input
                    type="text"
                    className="text-sm bg-white px-4 py-3 text-zinc-900 rounded-md focus:outline-none"
                    placeholder={t('Enter Email or Username...')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {isError && (
                    <span className="text-red-500 text-xs">
                      {t('Invalid email/username or password')}
                    </span>
                  )}
                </div>
                <div className="flex flex-col space-y-3">
                  <span className="text-sm">{t('Password')}</span>
                  <div className="relative">
                    <input
                      type={seePassword ? 'text' : 'password'}
                      className="text-sm bg-white px-4 py-3 text-zinc-900 rounded-md w-full focus:outline-none"
                      placeholder={t('Enter password...')}
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
                </div>

                {errCount >= 2 ? (
                  <>
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={process.env.NEXT_PUBLIC_SITEKEY}
                      onChange={() => {
                        setValidCaptcha(true);
                      }}
                      onExpired={() => {
                        setValidCaptcha(false);
                      }}
                      aria-required
                    />
                    {!validCaptcha && errCount >= 3 && (
                      <span className="text-red-500 text-xs">{t('Captcha is required')}</span>
                    )}
                  </>
                ) : null}

                <div className="flex justify-between items-center">
                  <div className="flex space-x-2 items-center">
                    <input
                      type="checkbox"
                      id="remember_me_1"
                      name="remember me"
                      value="Remember me"
                    />
                    <label htmlFor="remember_me_1" className="text-[#23FF2C]">
                      {t('Remember Me')}
                    </label>
                  </div>
                  <div className="text-slate-50">
                    <button
                      type="button"
                      onClick={() => {
                        dispatch(setModal({ name: 'modalForgotPassword', value: true }));
                        dispatch(setModal({ name: 'modalLogin', value: false }));
                      }}>
                      <h3 className="text-base font-normal hover:underline">
                        {t('Forgot Password?')}
                      </h3>
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="w-32 px-5 py-2 text-[#4100FF] bg-[#23FF2C] font-bold text-base rounded-md"
                    onClick={() => {
                      if (errCount >= 2) {
                        if (!validCaptcha) {
                          setErrCount(errCount + 1);
                        } else {
                          recaptchaRef.current.reset();
                          setValidCaptcha(false);
                          login({ email, password });
                        }
                      } else {
                        login({ email, password });
                      }
                    }}>
                    {isLoading ? 'Loading...' : `${t('Login')}`}
                  </button>
                </div>
                <div className="text-center m-auto flex space-x-1 mt-4">
                  <span className="text-base font-bold">
                    {t("Don't Have An Account ?")}
                    <button type="button" className="" onClick={handleSignUp}>
                      <span className="text-[#23FF2C] mx-1 hover:underline">{t('Sign Up')}</span>
                      {/* {
                        modalRegister ? <RegisterModal /> : 'err'
                      } */}
                    </button>
                  </span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
