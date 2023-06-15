import { Disclosure } from '@headlessui/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { useUpdatePasswordMutation } from 'core/services/rtk/AuthenticationServices';
import ErrorMessage from '../error/ErrorMessage';

export default function ChangePassword() {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [seeCurrentPassword, setSeeCurrentPassword] = useState(false);
  const [seeNewPassword, setSeeNewPassword] = useState(false);
  const [seeConfirmPassword, setSeeConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState({
    password: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [updatePassword, { isLoading, isSuccess, isError, error: errorUpdatePassword }] =
    useUpdatePasswordMutation();

  useEffect(() => {
    if (isSuccess) {
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success(t('Update password successful'));
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      if (errorUpdatePassword?.status === 500) {
        setError({ ...error, password: 'Password is incorrect' });
      }

      if (errorUpdatePassword?.status === 422) {
        setError({
          ...error,
          newPassword: errorUpdatePassword?.data?.errors?.password?.[0]
        });
      }
    }
  }, [isError]);

  return (
    <Disclosure>
      {({ open }) => (
        <div>
          <Disclosure.Button className="flex w-full justify-between text-left text-sm font-medium focus:outline-none bg-zinc-800 p-3 rounded-md ">
            <span className="text-lg text-slate-50 cursor-pointer hover:text-[#FF00CA] transition-all delay-100 ease-in-out font-bold">
              {t('Change password')}
            </span>
            <Image
              src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/chevron-down.png`}
              alt="chevron"
              width={26}
              height={26}
              className={`${open ? 'rotate-180 transform' : ''}`}
            />
            {/* <IoIosArrowDown
            className={`${open ? 'rotate-180 transform' : ''} h-5 w-5`}
          /> */}
          </Disclosure.Button>
          <Disclosure.Panel className="text-xs sm:text-sm py-8 md:py-10">
            <form
              onSubmit={(e) => {
                e.preventDefault();

                if (!password || password === '') {
                  setError({
                    ...error,
                    password: 'Password is required'
                  });

                  return;
                } else {
                  setError({
                    ...error,
                    password: ''
                  });
                }

                if (!newPassword) {
                  setError({
                    ...error,
                    newPassword: 'New password is required'
                  });

                  return;
                } else {
                  setError({
                    ...error,
                    newPassword: ''
                  });
                }

                if (!confirmPassword) {
                  setError({
                    ...error,
                    confirmPassword: 'Confirm password is required'
                  });

                  return;
                } else {
                  setError({
                    ...error,
                    confirmPassword: ''
                  });
                }

                if (password && newPassword && confirmPassword) {
                  updatePassword({
                    current_password: password,
                    password: newPassword,
                    password_confirmation: confirmPassword
                  });
                }
              }}>
              {console.log(error)}
              <div className="flex flex-col space-y-7 text-slate-50">
                {/* <h3 className="font-bold text-xl">{t('Change Password Here.')}</h3> */}
                <div className="flex flex-col space-y-3">
                  <label className="text-base font-semibold">{t('Mobile Current Password')}</label>
                  <div className="relative">
                    <input
                      type={seeCurrentPassword ? 'text' : 'password'}
                      className="text-sm bg-white px-4 py-3 text-[#0000FF] rounded-md w-full"
                      placeholder={t('Enter current password')}
                      // dont auto fill password
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => {
                        if (e.target.value === '') {
                          setError({ ...error, password: 'Password is required' });
                        } else {
                          setError({ ...error, password: '' });
                        }

                        if (e.target.value === newPassword && e.target.value !== '') {
                          setError({
                            ...error,
                            password: 'New password cannot be the same as the old password'
                          });
                        } else {
                          setError({ ...error, password: '' });
                        }
                        setPassword(e.target.value);
                      }}
                    />
                    <button
                      type="button"
                      className="absolute z-10 cursor-pointer h-full right-4 top-0 flex items-center"
                      onClick={() => setSeeCurrentPassword(!seeCurrentPassword)}>
                      {seeCurrentPassword ? (
                        <BsEye size={16} className="text-gray-600" />
                      ) : (
                        <BsEyeSlash size={16} className="text-gray-600" />
                      )}
                    </button>
                  </div>
                  <ErrorMessage message={t(error.password)} />
                </div>
                <div className="flex flex-col space-y-3">
                  <label className="text-base font-semibold">{t('New Password')}</label>
                  <div className="relative">
                    <input
                      type={seeNewPassword ? 'text' : 'password'}
                      className="w-full text-sm bg-white px-4 py-3 text-[#0000FF] rounded-md"
                      placeholder={t('Enter new password')}
                      value={newPassword}
                      onChange={(e) => {
                        if (e.target.value.length < 8 && e.target.value !== '') {
                          setError({
                            ...error,
                            newPassword: 'Password must be at least 8 characters long'
                          });
                        } else {
                          if (e.target.value === '') {
                            setError({ ...error, newPassword: 'Password is required' });
                          } else {
                            setError({ ...error, newPassword: '' });
                          }

                          if (e.target.value === password && e.target.value !== '') {
                            setError({
                              ...error,
                              newPassword: 'New password cannot be the same as the old password'
                            });
                          } else {
                            setError({ ...error, password: '', newPassword: '' });
                          }
                        }
                        setNewPassword(e.target.value);
                      }}
                    />
                    <button
                      type="button"
                      className="absolute z-10 cursor-pointer h-full right-4 top-0 flex items-center"
                      onClick={() => setSeeNewPassword(!seeNewPassword)}>
                      {seeNewPassword ? (
                        <BsEye size={16} className="text-gray-600" />
                      ) : (
                        <BsEyeSlash size={16} className="text-gray-600" />
                      )}
                    </button>
                  </div>
                  <ErrorMessage message={t(error.newPassword)} />
                </div>
                <div className="flex flex-col space-y-3">
                  <label className="text-base font-semibold">{t('Confirm New Password')}</label>
                  <div className="relative">
                    <input
                      type={seeConfirmPassword ? 'text' : 'password'}
                      className="text-sm bg-white px-4 py-3 text-[#0000FF] rounded-md w-full"
                      placeholder={t('Enter new password again')}
                      value={confirmPassword}
                      onChange={(e) => {
                        if (e.target.value === newPassword || e.target.value === '') {
                          setError({ ...error, confirmPassword: '' });
                        } else {
                          setError({
                            ...error,
                            confirmPassword: `${t('Password does not match')}`
                          });
                        }
                        setConfirmPassword(e.target.value);
                      }}
                    />
                    <button
                      type="button"
                      className="absolute z-10 cursor-pointer h-full right-4 top-0 flex items-center"
                      onClick={() => setSeeConfirmPassword(!seeConfirmPassword)}>
                      {seeConfirmPassword ? (
                        <BsEye size={16} className="text-gray-600" />
                      ) : (
                        <BsEyeSlash size={16} className="text-gray-600" />
                      )}
                    </button>
                  </div>
                  <ErrorMessage message={t(error.confirmPassword)} />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className={`
          px-5 py-2 text-[#4100FF] bg-[#23FF2C] font-bold text-base w-32 rounded-md
          ${
            password === '' ||
            newPassword === '' ||
            confirmPassword === '' ||
            error.password !== '' ||
            error.newPassword !== '' ||
            error.confirmPassword !== ''
              ? 'cursor-not-allowed'
              : ''
          }
        `}>
                    {isLoading ? 'Loading...' : `${t('Save')}`}
                  </button>
                </div>
              </div>
            </form>
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
}
