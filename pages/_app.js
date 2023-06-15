import { Provider } from 'react-redux';
import { store } from '../store/index';
import NextNProgress from 'nextjs-progressbar';
import Head from 'next/head';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.scss';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import Script from 'next/script';
import ErrorBoundary from 'components/layout/ErrorBoundary';
import LoginPublic from 'components/registration/LoginPublic'
import { getCookie } from 'cookies-next';
import '../i18n';

export default function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);
  const { locale, defaultLocale, push, pathname } = useRouter();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      console.clear();
      window.console.error = () => { };
      window.console.log = () => { };
      console.log = function () { };
      console.error = function () { };
    }
  }, []);

  const midtransScriptUrl = process.env.NEXT_PUBLIC_MIDTRANS_BASE_URL.includes('sandbox') ?
    "https://app.sandbox.midtrans.com/snap/snap.js" :
    "https://app.midtrans.com/snap/snap.js"

  // Optional: set script attribute, for example snap.js have data-client-key attribute 
  // (change the value according to your client-key)
  const myMidtransClientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

  useEffect(() => {
    // console.log('locale', locale);
    // console.log('defaultLocale', defaultLocale);
    // if (locale !== defaultLocale) {
    //   i18n.changeLanguage(defaultLocale);
    //   // push('/', '/', { locale: defaultLocale });
    // } else {
    //   i18n.changeLanguage(locale);
    //   // push('/en', '/en', { locale });
    // }
    if (locale) {
      localStorage.setItem('locale', locale);
    }


    i18n.changeLanguage(localStorage.getItem('locale') || defaultLocale);
  }, [i18n, locale]);

  const title = pageProps?.title ?? "Abracadabra"

  return (
    <Provider store={store}>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GTAG}`}
      />

      <Script strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GTAG}', {
          page_path: window.location.pathname,
          });
        `}
      </Script>

      <Script
        strategy="beforeInteractive"
        src={midtransScriptUrl}
        data-client-key={myMidtransClientKey}
      />

      <Head>
        <title>{title}</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
      </Head>

      <NextNProgress color="#FF00CA" />
      <ErrorBoundary>
        {(process.env.NEXT_PUBLIC_IS_PROTECTED && !getCookie('access_staging')) ||
        getCookie('access_staging') == "true" ? (
          <LoginPublic />
        ) : (
          getLayout(<Component {...pageProps} />, pageProps.bottomConfig)
        )}
      </ErrorBoundary>
      <ToastContainer />
    </Provider>
  );
}
