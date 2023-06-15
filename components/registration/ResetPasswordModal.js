import { useEffect, useState } from 'react';
import { RiCloseFill } from 'react-icons/ri';
import ErrorMessage from '../error/ErrorMessage';
import { useDispatch, useSelector } from 'react-redux';
import { setEmailOtp, setModal } from '../../core/redux/reducers/modalSlice';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { useResetPasswordMutation } from '../../core/services/rtk/AuthenticationServices';
import { authenticationApi } from '../../core/services/rtk/AuthenticationServices';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { setCredentials } from 'core/redux/reducers/authenticationSlice';
import { setRegister } from 'core/redux/reducers/authenticationSlice';

export default function ResetPasswordModal({ onClose }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [seePassword, setSeePassword] = useState(false);
  const { modalResetPassword } = useSelector((state) => state.modal);
  const { otp } = useSelector((state) => state.authentication);
  const { emailOtp } = useSelector((state) => state.modal);
  const [input, setInput] = useState({
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState({
    password: '',
    confirmPassword: ''
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    // password validation
    if (name === 'password') {
      if (value.length < 8) {
        setError({
          ...error,
          [name]: 'Password must be at least 8 characters'
        });
      } else {
        setError({
          ...error,
          [name]: ''
        });
      }
    }

    // confirm password validation
    if (name === 'confirmPassword') {
      if (value !== input.password) {
        setError({
          ...error,
          [name]: 'Password does not match'
        });
      } else {
        setError({
          ...error,
          [name]: ''
        });
      }
    }

    // empty error message
    if (value === '') {
      setError({
        ...error,
        [name]: ''
      });
    }

    setInput({
      ...input,
      [name]: value
    });
  };

  const [resetPassword, { data, isSuccess, isLoading, isError, error: errorResetPassword }] =
    useResetPasswordMutation();

  useEffect(() => {
    if (isSuccess) {
      dispatch(setModal({ name: 'modalResetPassword', value: false }));
      dispatch(setModal({ name: 'modalLogin', value: true }));
      dispatch(authenticationApi.util.resetApiState('resetPassword'));
      dispatch(setEmailOtp(null));
      dispatch(setRegister(null));
      toast.success(t('Reset Password Success'));
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      if (errorResetPassword?.message) {
        setError({
          ...error,
          password: errorResetPassword?.message
        });
      }
    }
  }, [isError]);

  return (
    <>
      <div className={`${modalResetPassword ? '' : 'hidden'} flex items-center justify-center`}>
        <div className="bg-black/20 fixed inset-0 w-full z-50 flex items-center md:justify-center">
          <div className="bg-[#2B1462] text-slate-50 rounded-r-2xl md:rounded-2xl px-8 md:px-8 pt-8 pb-12 flex flex-col animate-l-to-r w-[92%] md:max-w-md">
            <div className="flex justify-end">
              <RiCloseFill
                size={32}
                onClick={() => dispatch(setModal({ name: 'modalResetPassword', value: false }))}
                className="cursor-pointer"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <h3 className="text-2xl leading-6 mb-4 font-bold">{t('Reset Password')}</h3>
              <span className="text-xs md:text-sm font-medium">
                {t('Your new password must be different from previous used password.')}
              </span>
            </div>
            <form>
              <div className="mt-4 flex flex-col space-y-5">
                <div className="flex flex-col space-y-3">
                  <span className="text-sm">{t('Password')}</span>
                  <div className="relative">
                    <input
                      type={seePassword ? 'text' : 'password'}
                      className="text-sm bg-white px-4 py-3 text-zinc-900 rounded-md w-full focus:outline-none"
                      placeholder={t('Enter your password here...')}
                      name="password"
                      value={input.password}
                      onChange={handleInput}
                    />
                    <button
                      type="button"
                      className="absolute z-10 cursor-pointer h-full right-4 top-0 flex items-center"
                      onClick={() => setSeePassword(!seePassword)}
                    >
                      {seePassword ? (
                        <BsEye size={16} className="text-gray-600" />
                      ) : (
                        <BsEyeSlash size={16} className="text-gray-600" />
                      )}
                    </button>
                  </div>
                  <ErrorMessage message={t(error.password)} />
                </div>
                <div className="flex flex-col space-y-3">
                  <span className="text-sm">{t('Confirm Password')}</span>
                  <div className="relative">
                    <input
                      type={seePassword ? 'text' : 'password'}
                      className="text-sm bg-white px-4 py-3 text-zinc-900 rounded-md w-full focus:outline-none"
                      placeholder={t('Confirm your password')}
                      name="confirmPassword"
                      value={input.confirmPassword}
                      onChange={handleInput}
                    />
                    <button
                      type="button"
                      className="absolute z-10 cursor-pointer h-full right-4 top-0 flex items-center"
                      onClick={() => setSeePassword(!seePassword)}
                    >
                      {seePassword ? (
                        <BsEye size={16} className="text-gray-600" />
                      ) : (
                        <BsEyeSlash size={16} className="text-gray-600" />
                      )}
                    </button>
                  </div>
                  <ErrorMessage message={t(error.confirmPassword)} />
                </div>
                <div className="">
                  <button
                    type="button"
                    className="px-5 py-2 text-[#4100FF] bg-[#23FF2C] font-bold text-base w-full rounded-md"
                    onClick={() =>
                      resetPassword({
                        otp: otp,
                        password: input.password,
                        password_confirmation: input.confirmPassword
                      })
                    }
                  >
                    {isLoading ? 'Loading...' : `${t('Confirm')}`}
                  </button>
                </div>
                {/* <div className="">
                  <Link href="#">
                    <span className="text-[#23FF2C] mx-1 underline">Sign Up</span>
                  </Link>
                </div> */}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
