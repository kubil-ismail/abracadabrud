import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { deleteCookie, setCookie } from 'cookies-next';
import { useTranslation } from 'react-i18next';

export default function LoginModal({ onClose }) {
  const [seePassword, setSeePassword] = useState(false);
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);


  return (
    <div style={{ backgroundColor: '#1C1C1C', height: '100vh' }}>
      <div className="flex items-center justify-center">
        <div className="bg-black/20 fixed inset-0 w-full z-50 flex items-center md:justify-center">
          <div className="bg-[#2B1462] text-slate-50 rounded-r-2xl md:rounded-2xl px-6 md:px-8 pt-8 pb-12 flex flex-col animate-l-to-r w-[92%] md:max-w-md">
            <div className="flex flex-col space-y-1">
              <h3 className="text-xl md:text-2xl leading-4 mb-2 font-bold">
                {t('Akses web staging')}
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

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="w-32 px-5 py-2 text-[#4100FF] bg-[#23FF2C] font-bold text-base rounded-md"
                    onClick={() => {
                        if (process.env.NEXT_PUBLIC_LOCAL_EMAIL !== email) {
                            setIsError(true);
                            return;
                        }

                        if (process.env.NEXT_PUBLIC_LOCAL_PASS !== password) {
                            setIsError(true);
                            return;
                        }

                        setIsError(false);
                        setCookie('access_staging', true, { maxAge: 60 * 60 * 24, secure: true, sameSite: true });

                        setTimeout(() => {
                            window.location.reload();
                        }, 100)
                    }}>
                    {t('Login')}
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
