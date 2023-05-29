import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { RiCloseFill } from 'react-icons/ri';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import {
  useRegisterMutation,
  useCompleteBasicProfileMutation,
  useSelectRoleMutation
} from 'core/services/rtk/AuthenticationServices';
import {
  setCredentials,
  setRegister,
  resetReferralCode,
  setMainLang
} from 'core/redux/reducers/authenticationSlice';
import OtpConfirmModal from './OtpConfirmationModal';
import {
  setModal,
  setEmailOtpRegister,
  setEmailOtpChanged,
  setEmailOtp
} from 'core/redux/reducers/modalSlice';
import ErrorMessage from '../error/ErrorMessage';
import isStillError from 'core/utils/isStillError';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { setCookie } from 'cookies-next';
import ReCAPTCHA from 'react-google-recaptcha';

export default function RegisterModal({ onClose }) {
  const recaptchaRef = useRef();
  const { t } = useTranslation();
  const [seePassword, setSeePassword] = useState(false);
  const [seePassword2, setSeePassword2] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const dispatch = useDispatch();
  const { push } = useRouter();
  const [validCaptcha, setValidCaptcha] = useState(false);
  const [errCount, setErrCount] = useState(0);
  const [inputs, setInputs] = useState({
    fullname: '',
    username: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    referalCode: ''
  });

  const [lang, setLang] = useState('1');

  const { dataRegister, isAuthenticated, token, referralCode } = useSelector(
    (state) => state.authentication
  );
  const { modalRegister, modalOtp, modalLogin } = useSelector((state) => state.modal);

  useEffect(() => {
    if (dataRegister) {
      setInputs({
        fullname: dataRegister.fullname || '',
        username: dataRegister.username || '',
        email: dataRegister.email || '',
        mobile: dataRegister.mobile || '',
        password: dataRegister.password || '',
        confirmPassword: dataRegister.confirmPassword || '',
        referalCode: dataRegister?.referalCode || ''
      });
    }
  }, [dataRegister]);

  useEffect(() => {
    if (referralCode) {
      setInputs((input) => ({ ...input, referalCode: referralCode }));
    }
  }, [referralCode]);

  const [registerError, setRegisterError] = useState({
    fullname: '',
    username: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    referalCode: ''
  });

  const scrollToError = () => {
    if (registerError?.fullname) {
      document.getElementById('fullname').focus();
    } else if (registerError?.username) {
      document.getElementById('username').focus();
    } else if (registerError?.mobile) {
      document.getElementById('mobile').focus();
    } else if (registerError?.email) {
      document.getElementById('email').focus();
    } else if (registerError?.password) {
      document.getElementById('password').focus();
    } else if (registerError?.confirmPassword) {
      document.getElementById('confirmPassword').focus();
    } else if (registerError?.referalCode) {
      document.getElementById('referalCode').focus();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'fullname') {
      // can only contain letters, spaces
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        return;
      }
      if (value.length < 3 && value.length > 0) {
        setRegisterError((registerError) => ({
          ...registerError,
          fullname: 'Fullname must be at least 3 characters'
        }));
      } else {
        setRegisterError((registerError) => ({ ...registerError, fullname: '' }));
      }
    }

    if (name === 'username') {
      // allow all letters, numbers, and underscores no spaces
      if (value.length > 30) {
        return;
      }
      // if value has space
      if (value.includes(' ')) {
        return;
      }
      if (!/^[a-zA-Z0-9_]*$/.test(value) && value.length > 0) {
        setRegisterError((registerError) => ({
          ...registerError,
          username: 'Username must be alphanumeric, underscore and no spaces'
        }));
      } else {
        if (value.length < 3 && value.length > 0) {
          setRegisterError((registerError) => ({
            ...registerError,
            username: 'Username must be at least 3 characters'
          }));
        } else {
          setRegisterError((registerError) => ({ ...registerError, username: '' }));
        }
      }
    }

    if (name === 'email') {
      const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!regex.test(value) && value.length > 0) {
        setRegisterError((registerError) => ({ ...registerError, email: 'Email is invalid' }));
      } else {
        setRegisterError((registerError) => ({ ...registerError, email: '' }));
      }
    }

    if (name === 'mobile') {
      const regex = /^[0-9]*$/;
      if (!regex.test(value)) {
        return;
      }

      if (value.length < 9 && value.length > 0) {
        setRegisterError((registerError) => ({
          ...registerError,
          mobile: 'Phone number must be at least 9 characters'
        }));
      } else {
        setRegisterError((registerError) => ({ ...registerError, mobile: '' }));
      }

      if (value.length > 13) {
        return;
      }
    }

    if (name === 'password') {
      if (value.length < 8 && value.length > 0) {
        setRegisterError((registerError) => ({
          ...registerError,
          password: 'Password must be at least 8 characters'
        }));
      } else {
        setRegisterError((registerError) => ({ ...registerError, password: '' }));
      }
    }

    if (name === 'confirmPassword') {
      if (value !== inputs.password && value.length > 0) {
        setRegisterError((registerError) => ({
          ...registerError,
          confirmPassword: `${t('Password does not match')}`
        }));
      } else {
        setRegisterError((registerError) => ({ ...registerError, confirmPassword: '' }));
      }
    }

    if (name === 'referalCode') {
      if (value && (value.length > 20 || value.length < 5)) {
        setRegisterError((registerError) => ({
          ...registerError,
          referalCode: `${t('Invalid referral code')}`
        }));
      } else {
        setRegisterError((registerError) => ({ ...registerError, referalCode: '' }));
      }
    }

    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };

  const [
    register,
    {
      data: dataReg,
      isLoading: isLoadingRegister,
      isError: isErrorRegister,
      isSuccess: isSuccessRegister,
      error: errorRegister
    }
  ] = useRegisterMutation();

  const [
    selectRole,
    {
      data: dataRole,
      isLoading: isLoadingRole,
      isError: isErrorRole,
      isSuccess: isSuccessRole,
      error: errorRole
    }
  ] = useSelectRoleMutation();

  const [
    completeBasicProfile,
    {
      data: dataCompleteProfile,
      isLoading: isLoadingCompleteProfile,
      isError: isErrorCompleteProfile,
      isSuccess: isSuccessCompleteProfile,
      error: errorCompleteProfile
    }
  ] = useCompleteBasicProfileMutation();

  // success start
  useEffect(() => {
    if (isSuccessRegister) {
      setCookie('_token', dataReg?.token);
      dispatch(setCredentials(dataReg));
      const role = 1;
      selectRole({ role });
    }
  }, [isSuccessRegister]);

  useEffect(() => {
    if (isSuccessRole) {
      const { fullname, username, mobile, password, confirmPassword, referalCode } = inputs;

      completeBasicProfile({
        firstname: fullname,
        username,
        phone: mobile,
        password,
        password_confirmation: confirmPassword,
        referal_code: referalCode ? `${atob(referalCode)}ACADABRA0` : '',
        pref_language: lang
      });

      dispatch(resetReferralCode());
    }
  }, [isSuccessRole]);

  useEffect(() => {
    if (isSuccessCompleteProfile) {
      dispatch(setRegister(inputs));
      dispatch(setMainLang(lang));
      dispatch(setModal({ name: 'modalRegister', value: false }));
      dispatch(setModal({ name: 'modalOtp', value: true }));
      dispatch(setEmailOtpRegister(inputs?.email));
      dispatch(setEmailOtpChanged(null));
      dispatch(setEmailOtp(null));
    }
  }, [isSuccessCompleteProfile]);
  // success end

  // error start
  useEffect(() => {
    if (isErrorRegister) {
      setErrCount(errCount + 1);
      errorRegister?.data?.errors?.email.map((error) => {
        setRegisterError((registerError) => ({ ...registerError, email: error }));
      });
    }
  }, [isErrorRegister]);

  useEffect(() => {
    if (isErrorRole) {
      // dispatch(authenticationApi.util.resetApiState('selectRole'));
    }
  }, [isErrorRole]);

  useEffect(() => {
    if (isErrorCompleteProfile) {
      console.log('errorCompleteProfile', errorCompleteProfile);
      if (errorCompleteProfile?.data?.errors?.username) {
        errorCompleteProfile?.data?.errors?.username.map((error) => {
          setRegisterError((registerError) => ({ ...registerError, username: error }));
        });
        document.getElementById('username')?.focus();
      }
      if (errorCompleteProfile?.data?.errors?.phone) {
        errorCompleteProfile?.data?.errors?.phone.map((error) => {
          setRegisterError((registerError) => ({ ...registerError, mobile: error }));
        });
        document.getElementById('mobile')?.focus();
      }
      if (errorCompleteProfile?.data?.errors?.referal_code) {
        errorCompleteProfile?.data?.errors?.referal_code.map((error) => {
          setRegisterError((registerError) => ({ ...registerError, referalCode: error }));
        });
        document.getElementById('referalCode')?.focus();
      }
      // dispatch(authenticationApi.util.resetApiState('completeBasicProfile'));
    }
  }, [isErrorCompleteProfile]);
  // error end

  const handleChecked = (e) => {
    setIsChecked(e.target.checked);
  };

  useEffect(() => {
    if (modalRegister) {
      if (lang === '1') {
        push('/id', '/id', { locale: 'id' });
      } else {
        push('/', '/', { locale: 'en' });
      }
    }
  }, [lang]);

  const handleLogin = () => {
    if (!isAuthenticated) {
      dispatch(setModal({ name: 'modalLogin', value: true }));
      dispatch(setModal({ name: 'modalRegister', value: false }));
    }
  };

  // useEffect(() => {
  //   scrollToError();
  // }, [registerError]);

  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    scrollToError();
  }, [clicked]);

  return (
    <>
      {/* {modalLogin ? <LoginModal /> : null } */}
      {modalOtp ? <OtpConfirmModal /> : null}
      <div className={`${!modalRegister ? 'hidden' : 'fixed justify-center z-50'}`}>
        <div className="bg-black/20 fixed inset-0 w-full z-50 flex items-center md:justify-center py-5">
          <div className="bg-[#2B1462] text-slate-50 rounded-r-2xl md:rounded-2xl px-8 md:px-8 pt-8 pb-12 flex flex-col animate-l-to-r w-[92%] md:max-w-md">
            <div className="flex justify-end">
              <RiCloseFill
                size={32}
                onClick={() => dispatch(setModal({ name: 'modalRegister', value: false }))}
                className="cursor-pointer mb-4"
              />
            </div>
            <h3 className="text-2xl leading-6 font-bold">
              {t('Register to upload videos, vote, collect points, and win amazing prizes!')}
            </h3>
            <form className="overflow-y-scroll h-[420px] pr-1 md:pr-4 mt-3">
              <div className="mt-4 flex flex-col space-y-2 ">
                <div className="flex flex-col space-y-3">
                  <span className="text-sm">{t('Fullname')}</span>
                  <input
                    type="text"
                    className={
                      `
                    text-sm bg-white px-4 py-3 text-zinc-900 rounded-md focus:outline-none
                    ` + (registerError.fullname ? 'border-2 border-red-500' : '')
                    }
                    placeholder={t('Enter fullname')}
                    name="fullname"
                    id="fullname"
                    value={inputs.fullname}
                    onChange={handleChange}
                  />
                  <ErrorMessage message={t(registerError.fullname)} />
                </div>
                <div className="flex flex-col space-y-3">
                  <span className="text-sm">{t('Username')}</span>
                  <input
                    type="text"
                    className={
                      `
                    text-sm bg-white px-4 py-3 text-zinc-900 rounded-md focus:outline-none
                    ` + (registerError.username ? 'border-2 border-red-500' : '')
                    }
                    placeholder={t('Enter your username')}
                    name="username"
                    id="username"
                    value={inputs.username}
                    onChange={handleChange}
                  />
                  <ErrorMessage message={t(registerError.username)} />
                </div>
                <div className="flex flex-col space-y-3">
                  <span className="text-sm">{t('Mobile Number')}</span>
                  <input
                    type="text"
                    className={
                      `
                    text-sm bg-white px-4 py-3 text-zinc-900 rounded-md focus:outline-none
                    ` + (registerError.mobile ? 'border-2 border-red-500' : '')
                    }
                    placeholder={t('Enter your mobile number')}
                    name="mobile"
                    id="mobile"
                    value={inputs.mobile}
                    onChange={handleChange}
                    onKeyDown={(e) => {
                      if (e.key === 'e' || e.key === '-') {
                        e.preventDefault();
                      }
                    }}
                  />
                  <ErrorMessage message={t(registerError.mobile)} />
                </div>
                <div className="flex flex-col space-y-3">
                  <span className="text-sm">Email</span>
                  <input
                    type="email"
                    className={
                      `
                    text-sm bg-white px-4 py-3 text-zinc-900 rounded-md focus:outline-none
                    ` + (registerError.email ? 'border-2 border-red-500' : '')
                    }
                    placeholder={t('Enter your email')}
                    name="email"
                    id="email"
                    value={inputs.email}
                    onChange={handleChange}
                  />
                  <ErrorMessage message={t(registerError.email)} />
                </div>
                <div className="flex flex-col space-y-3">
                  <span className="text-sm">{t('Password')}</span>
                  <div className="relative">
                    <input
                      type={seePassword ? 'text' : 'password'}
                      className={
                        `
                      w-full text-sm bg-white px-4 py-3 text-zinc-900 rounded-md focus:outline-none
                      ` + (registerError.email ? 'border-2 border-red-500' : '')
                      }
                      placeholder={t('Enter a password')}
                      name="password"
                      id="password"
                      value={inputs.password}
                      onChange={handleChange}
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
                  <ErrorMessage message={t(registerError.password)} />
                </div>
                <div className="flex flex-col space-y-3">
                  <span className="text-sm">{t('Confirm Password')}</span>
                  <div className="relative">
                    <input
                      type={seePassword2 ? 'text' : 'password'}
                      className={
                        `
                      w-full text-sm bg-white px-4 py-3 text-zinc-900 rounded-md focus:outline-none
                      ` + (registerError.email ? 'border-2 border-red-500' : '')
                      }
                      placeholder={t('Enter password again')}
                      name="confirmPassword"
                      id="confirmPassword"
                      value={inputs.confirmPassword}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="absolute z-10 cursor-pointer h-full right-4 top-0 flex items-center"
                      onClick={() => setSeePassword2(!seePassword2)}>
                      {seePassword2 ? (
                        <BsEye size={16} className="text-gray-600" />
                      ) : (
                        <BsEyeSlash size={16} className="text-gray-600" />
                      )}
                    </button>
                  </div>
                  <ErrorMessage message={t(registerError.confirmPassword)} />
                </div>
                <div className="flex flex-col space-y-3 mb-3">
                  <span className="text-sm">{t('Preferred Language')}</span>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="flexRadioDefault"
                        value="1"
                        onChange={(e) => setLang(e.target.value)}
                        defaultChecked
                      />
                      <span className="text-sm">Bahasa Indonesia</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="flexRadioDefault"
                        value="2"
                        onChange={(e) => setLang(e.target.value)}
                      />
                      <span className="text-sm">English</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-3">
                  <span className="text-sm">{t('Referral Code (Optional)')}</span>
                  <input
                    type="text"
                    className={
                      `
                    text-sm bg-white px-4 py-3 text-zinc-900 rounded-md focus:outline-none
                    ` + (registerError.referalCode ? 'border-2 border-red-500' : '')
                    }
                    placeholder={t('Enter Refferal Code')}
                    name="referalCode"
                    onChange={handleChange}
                    value={inputs?.referalCode}
                  />
                  <ErrorMessage message={t(registerError.referalCode)} />
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

                <div className="flex space-x-2">
                  <input
                    type="checkbox"
                    id="remember_me_2"
                    name="remember me"
                    value={!isChecked}
                    onChange={handleChecked}
                  />
                  <label htmlFor="remember_me_2" className="text-slate-50 text-sm">
                    {t('I have read and agree to the')}{' '}
                    <Link href="/support/terms-of-service">
                      <span
                        className="text-[#23FF2C] underline"
                        aria-hidden
                        onClick={() => dispatch(setModal({ name: 'modalRegister', value: false }))}>
                        {t('Terms Of Service')}
                      </span>
                    </Link>{' '}
                    {t('and')}{' '}
                    <Link href="/support/privacy-policy">
                      {' '}
                      <span
                        className="text-[#23FF2C] underline"
                        aria-hidden
                        onClick={() => dispatch(setModal({ name: 'modalRegister', value: false }))}>
                        {t('Privacy Policy')}
                      </span>
                    </Link>{' '}
                  </label>
                </div>
                {!isChecked && <ErrorMessage message={t('You must agree terms and condition')} />}
                <div className="flex justify-end mt-5">
                  <button
                    type="button"
                    disabled={!isChecked}
                    className="w-32 px-5 py-2 text-[#4100FF] bg-[#23FF2C] font-bold text-base rounded-md"
                    onClick={() => {
                      if (errCount >= 2) {
                        if (!validCaptcha) {
                          setErrCount(errCount + 1);
                        }
                      }

                      if (inputs.fullname === '') {
                        setRegisterError((registerError) => ({
                          ...registerError,
                          fullname: 'Fullname is required'
                        }));
                      }
                      if (inputs.username === '') {
                        setRegisterError((registerError) => ({
                          ...registerError,
                          username: 'Username is required'
                        }));
                      }
                      if (inputs.mobile === '') {
                        setRegisterError((registerError) => ({
                          ...registerError,
                          mobile: 'Mobile is required'
                        }));
                      }
                      if (inputs.email === '') {
                        setRegisterError((registerError) => ({
                          ...registerError,
                          email: 'Email is required'
                        }));
                      }
                      if (inputs.password === '') {
                        setRegisterError((registerError) => ({
                          ...registerError,
                          password: 'Password is required'
                        }));
                      }
                      if (inputs.confirmPassword === '') {
                        setRegisterError((registerError) => ({
                          ...registerError,
                          confirmPassword: 'Confirm Password is required'
                        }));
                      }
                      if (inputs.password !== inputs.confirmPassword) {
                        setRegisterError((registerError) => ({
                          ...registerError,
                          confirmPassword: 'Password and Confirm Password must be same'
                        }));
                        // document.getElementById('confirmPassword').focus();
                      }

                      scrollToError();
                      setClicked(!clicked);

                      if (isStillError(registerError)) return;

                      const validInput =
                        inputs.fullname !== '' &&
                        inputs.username !== '' &&
                        inputs.mobile !== '' &&
                        inputs.email !== '' &&
                        inputs.password !== '' &&
                        inputs.confirmPassword !== '' &&
                        inputs.password === inputs.confirmPassword;

                      if (validInput) {
                        if (errCount >= 2 && validCaptcha) {
                          recaptchaRef.current.reset();
                          setValidCaptcha(false);
                          register({ email: inputs.email });
                        } else if (errCount < 2) {
                          if (recaptchaRef.current) recaptchaRef.current.reset();
                          setValidCaptcha(false);
                          register({ email: inputs.email });
                        }
                      }
                    }}>
                    {' '}
                    {isLoadingRegister || isLoadingRole || isLoadingCompleteProfile
                      ? 'Loading...'
                      : `${t('Submit')}`}{' '}
                  </button>
                </div>
                <div className="text-center m-auto flex space-x-1 pt-4">
                  <span className="text-base font-bold">
                    {t('Already have an account ?')}
                    <button type="button" onClick={handleLogin}>
                      <span className="text-[#23FF2C] mx-1 hover:underline">{t('Login')}</span>
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
    </>
  );
}
