import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

export default function TabsSupport() {
  const router = useRouter();
  const { t } = useTranslation()
  return (
    <div className="flex flex-col space-y-3">
      <Link href="/support/terms-of-service">
        <button
          className={
            router.pathname === '/support/terms-of-service'
              ? 'mx-auto text-slate-50 pt-3 pb-2 px-3 font-semibold text-base lg:text-lg'
              : 'mx-auto text-slate-400 pt-3 pb-2 px-3 font-medium text-base lg:text-lg'
          }
          type="button"
        >
          {t('Terms Of Service')}
        </button>
      </Link>
      <Link href="/support/privacy-policy">
        <button
          className={
            router.pathname === '/support/privacy-policy'
              ? 'mx-auto text-slate-50 pt-3 pb-2 px-3 font-semibold text-base lg:text-lg'
              : 'mx-auto text-slate-400 pt-3 pb-2 px-3 font-medium text-base lg:text-lg'
          }
          type="button"
        >
          {t('Privacy Policy')}
        </button>
      </Link>
      {/* <Link href="/support/official-rules">
        <button
          className={
            router.pathname === '/support/official-rules'
              ? 'mx-auto text-slate-50 pt-3 pb-2 px-3 font-semibold text-base lg:text-lg'
              : 'mx-auto text-slate-400 pt-3 pb-2 px-3 font-medium text-base lg:text-lg'
          }
          type="button"
        >
          {t('Official Rules')}
        </button>
      </Link> */}
    </div>
  );
}
