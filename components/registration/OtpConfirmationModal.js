import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { RiCloseFill } from 'react-icons/ri';
import {
  useConfirmOtpRegisterMutation,
  useLoginMutation,
  useResendOtpMutation,
  useResendOtpChangedMutation,
  useUpdateEmailMutation,
  useForgotPasswordMutation,
  useConfirmOtpForgotPasswordMutation
} from '../../core/services/rtk/AuthenticationServices';
import { useDispatch, useSelector } from 'react-redux';
import { setEmailOtp, setEmailOtpRegister, setModal } from '../../core/redux/reducers/modalSlice';
import { authenticationApi } from '../../core/services/rtk/AuthenticationServices';
import {
  setCredentials,
  setIsAuthenticated,
  setRegister,
  setOtpState,
  authenticationState,
  setChangedEmail
} from '../../core/redux/reducers/authenticationSlice';
import { toast } from 'react-toastify';
import { useEnrollUserToAllEventsMutation } from '../../core/services/rtk/EventServices';
import useCountDown from '../../core/hooks/useCountdown';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { setCookie } from 'cookies-next';

export default function OtpConfirmModal({ onClose }) {
  const router = useRouter();
  const { t } = useTranslation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // create an array of 6 empty strings
  const [numOtp, setNumOtp] = useState([]); // create an array of 6 empty strings
  const [emailUser, setEmailUser] = useState('');
  const [emailUserOtp, setEmailUserOtp] = useState('');
  // merge each otp input into one string

  const { emailForgotPassword } = useSelector(authenticationState);

  const { emailOtp } = useSelector((state) => state.modal);

  const { timer, resetTimer, startFromZero } = useCountDown(60);

  const otpString = otp.join('');

  const handleChangeOtp = (e) => {
    setNumOtp(e.target.value);
  };

  const handleChange = (e, index) => {
    const { value } = e.target;

    // not allow negative values
    if (value < 0) return;

    // only one digit allowed
    if (value.length > 1) return;

    // not allowed space
    if (value === ' ') return;

    // if empty and press backspace, focus to previous input
    if (value === '' && index > 0) {
      setOtp([...otp.slice(0, index), value, ...otp.slice(index + 1)]);
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
      prevInput?.select();
      return;
    }

    // if not empty, focus to next input
    if (value !== '') {
      setOtp([...otp.slice(0, index), value, ...otp.slice(index + 1)]);
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
      nextInput?.select();
      return;
    }

    // if empty and not first input, focus to previous input
    if (value === '' && index === 0) {
      setOtp([...otp.slice(0, index), value, ...otp.slice(index + 1)]);
      return;
    }

    // arrow key navigation
    if (e.keyCode === 37 && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
      prevInput?.select();
      return;
    }

    if (e.keyCode === 39 && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
      nextInput?.select();
      return;
    }

    // arrow key left and right navigation
    if (e.keyCode === 37 && index === 0) {
      return;
    }

    if (e.keyCode === 39 && index === 5) {
      return;
    }

    // update the otp state
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const dispatch = useDispatch();

  const { dataRegister, user, dataForgotPassword, mainLang } = useSelector(
    (state) => state.authentication
  );

  const { modalOtp, emailChangedOtp } = useSelector((state) => state.modal);

  const [confirmOtpRegister, { data, isLoading, isSuccess, isError, error }] =
    useConfirmOtpRegisterMutation();

  const [confirmOtpForgotPassword, { isSuccess: isSuccessConfirmForgotPassword }] =
    useConfirmOtpForgotPasswordMutation();

  const [resendOtp] = useResendOtpMutation();

  const [
    forgotPassword,
    {
      isLoading: isLoadingForgotPassword,
      isSuccess: isSuccessForgotPassword,
      isError: isErrorForgotPassword,
      error: errorForgotPassword
    }
  ] = useForgotPasswordMutation();

  const [
    login,
    {
      data: dataLogin,
      isLoading: isLoadingLogin,
      isSuccess: isSuccessLogin,
      isError: isErrorLogin,
      error: errorLogin
    }
  ] = useLoginMutation();

  const [resendEmail] = useResendOtpChangedMutation();
  const [
    changedEmail,
    { isSuccess: isChangeSuccess, isLoading: isChangeLoading, isError: isChangeError }
  ] = useUpdateEmailMutation();

  useEffect(() => {
    if (isSuccessConfirmForgotPassword) {
      dispatch(setModal({ name: 'modalOtp', value: false }));
      dispatch(setModal({ name: 'modalResetPassword', value: true }));
      dispatch(setOtpState(numOtp));
      dispatch(setEmailOtp(null));
    }
  }, [isSuccessConfirmForgotPassword]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(setCredentials(data));
      if (dataRegister) {
        const { username, password } = dataRegister;
        login({ email: username, password });
      } else {
        dispatch(setModal({ name: 'modalOtp', value: false }));
        dispatch(setModal({ name: 'modalResetPassword', value: true }));
        dispatch(setEmailOtpRegister(null));
      }
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isChangeSuccess) {
      toast.success(t('Success change email'));
      dispatch(setModal({ name: 'modalOtp', value: false }));
      dispatch(setChangedEmail(emailChangedOtp?.email));
    }
  }, [isChangeSuccess]);

  const handleResend = () => {
    if (timer < 1) {
      if (emailChangedOtp) {
        resendEmail(emailChangedOtp);
      } else if (emailOtp) {
        forgotPassword({
          email: emailOtp
        });
      } else {
        resendOtp({
          identity: dataRegister?.email || emailOtp || emailUser
        });
      }
      resetTimer();
    }
  };

  const { push } = useRouter();

  const changeLang = (lang, lang2) => {
    if (dataLogin?.user?.pref_language === '1' || dataLogin?.user?.pref_language === 1) {
      push(lang, lang, { locale: 'id' });
    } else {
      push(lang2, lang2, { locale: 'en' });
    }
  };

  useEffect(() => {
    if (isSuccessLogin) {
      dispatch(setCredentials(dataLogin));
      dispatch(setIsAuthenticated(true));
      dispatch(setModal({ name: 'modalOtp', value: false }));
      dispatch(setRegister(null));
      dispatch(setIsAuthenticated(true));
      dispatch(authenticationApi.util.resetApiState('login'));
      toast.success(t('Successfully register to abracadabra'));

      setTimeout(() => {
        if (!router.pathname.includes('/video')) {
          console.log('dataLogin', dataLogin);
          setCookie('_userId', dataLogin?.user?.id);
          setCookie('_token', dataLogin?.token);

          changeLang('/', '/en');
        } else {
          setCookie('_userId', dataLogin?.user?.id);
          setCookie('_token', dataLogin?.token);

          changeLang(router.asPath, router.asPath);
        }
      }, 2000);
    }
  }, [isSuccessLogin]);

  useEffect(() => {
    if (emailOtp) {
      setEmailUserOtp(emailOtp);
    } else {
      setEmailUser(user?.email);
    }
  }, [emailOtp, user]);

  useEffect(() => {
    resetTimer();
    if (!modalOtp) {
      startFromZero();
    }
    setNumOtp([]);
  }, [modalOtp]);

  return (
    <>
      <div className={`${modalOtp ? '' : 'hidden'} flex items-center justify-center`}>
        <div className="bg-black/20 fixed inset-0 w-full z-50 flex items-center md:justify-center">
          <div className="bg-[#2B1462] text-slate-50 rounded-r-2xl md:rounded-2xl px-8 md:px-8 pt-8 pb-12 flex flex-col animate-l-to-r w-[92%] md:max-w-md">
            <div className="flex justify-end">
              <RiCloseFill
                size={32}
                onClick={() => {
                  dispatch(setModal({ name: 'modalOtp', value: false }));
                }}
                className="cursor-pointer"
              />
            </div>
            <h3 className="text-2xl font-bold leading-6 mb-4">{t('Confirmation OTP')}</h3>

            <div className="mt-4 flex flex-col gap-5">
              <div className="">
                <Image
                  alt="otp confirm"
                  width={0}
                  height={0}
                  sizes="30vw"
                  style={{ width: '50%', height: 'auto' }}
                  quality={100}
                  src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/otp-confirm.png`}
                  className="w-44 m-auto"
                />
              </div>
              <div className="text-center">
                {emailChangedOtp?.email ? (
                  <span className="text-sm">
                    {t("We've sent you a six digit confirmation code to:")}
                    <strong className="mx-1 text-[#23FF2C]">{emailChangedOtp?.email}</strong>
                    {t('Please enter the code below.')}
                  </span>
                ) : (
                  <>
                    {emailOtp ? (
                      <span className="text-sm">
                        {t(
                          "Thank you for signing up, We've sent you a six digit confirmation code to:"
                        )}{' '}
                        <strong className="mx-1 text-[#23FF2C]">{emailOtp}</strong>
                        {t('Please enter the code below.')}
                      </span>
                    ) : (
                      <span className="text-sm">
                        {t(
                          "Thank you for signing up, We've sent you a six digit confirmation code to:"
                        )}
                        <strong className="mx-1 text-[#23FF2C]">{emailUser}</strong>
                        {t('Please enter the code below.')}
                      </span>
                    )}
                  </>
                )}
              </div>
              <form autocomplete="off">
                <div className="">
                  <input
                    type="text"
                    className="w-full bg-transparent border-b-2 border-white text-slate-50 text-2xl font-bold text-center px-4 py-3 focus:outline-none"
                    id="otp-1"
                    value={numOtp}
                    autocomplete="false"
                    onChange={handleChangeOtp}
                  />
                  {/* <input type="text" className="w-12 h-12 bg-white text-zinc-800 rounded-md text-center font-semibold" id="otp-2" value={otp[2]} onChange={(e) => handleChange(e, 2)} />
                  <input type="text" className="w-12 h-12 bg-white text-zinc-800 rounded-md text-center font-semibold" id="otp-3" value={otp[3]} onChange={(e) => handleChange(e, 3)} />
                  <input type="text" className="w-12 h-12 bg-white text-zinc-800 rounded-md text-center font-semibold" id="otp-4" value={otp[4]} onChange={(e) => handleChange(e, 4)} />
                  <input type="text" className="w-12 h-12 bg-white text-zinc-800 rounded-md text-center font-semibold" id="otp-5" value={otp[5]} onChange={(e) => handleChange(e, 5)} />
                  <input type="text" className="w-12 h-12 bg-white text-zinc-800 rounded-md text-center font-semibold" id="otp-6" value={otp[6]} onChange={(e) => handleChange(e, 6)} /> */}
                </div>
              </form>
              {(isError || isChangeError || isErrorForgotPassword) && (
                <div className="text-red-500 text-sm">{t('OTP is not valid')}</div>
              )}
              <div className="flex justify-end mt-3">
                <div className="flex gap-3 items-center">
                  <button
                    type="button"
                    className="px-5 py-2 text-[#23FF2C] font-medium text-base"
                    onClick={handleResend}>
                    {timer > 0 ? `${t('Resend OTP in')} ${timer}` : `${t('Send code again')}`}
                  </button>
                  <button
                    type="button"
                    className="px-5 py-2 text-[#4100FF] bg-[#23FF2C] font-bold text-base"
                    onClick={() => {
                      if (emailChangedOtp) {
                        changedEmail({ otp: numOtp });
                      } else if (emailOtp) {
                        confirmOtpForgotPassword({
                          otp: numOtp
                        });
                      } else {
                        confirmOtpRegister({
                          otp: numOtp
                        });
                      }
                    }}>
                    {isLoading || isLoadingLogin || isChangeLoading || isLoadingForgotPassword
                      ? 'Loading...'
                      : `${t('Confirm')}`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
