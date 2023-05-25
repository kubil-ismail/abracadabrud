import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta httpEquiv="Cache-control" content="public"></meta>
        <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />

        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        <meta name="theme-color" content="#ffffff"></meta>

        <meta name="application-name" content="Abracadabra" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Abracadabra" />
        <meta name="description" content="Abracadabra satu mantra wujudkan impianku" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#2B5797" />
        <meta name="msapplication-tap-highlight" content="no" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content={process.env.NEXT_PUBLIC_SITE_URL} />
        <meta name="twitter:title" content="Abracadabra" />
        <meta name="twitter:description" content="Abracadabra satu mantra wujudkan impianku" />
        <meta name="twitter:image" content="/favicon-96x96.png" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Abracadabra" />
        <meta property="og:description" content="Abracadabra satu mantra wujudkan impianku" />
        <meta property="og:site_name" content="Abracadabra" />
        <meta property="og:url" content={process.env.NEXT_PUBLIC_SITE_URL} />
        <meta property="og:image" content="/favicon-96x96.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
        {/* freshchat */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            function initFreshChat() {
              window.fcWidget.init({
                    token: "daefdfe2-64f4-4a47-a5d9-040d2ff79bc4",
                    host: "https://ptbposeveninovasiindonesia.freshchat.com"
              });
            }
            function initialize(i,t){var e;i.getElementById(t)?
            initFreshChat():((e=i.createElement("script")).id=t,e.async=!0,
            e.src="https://ptbposeveninovasiindonesia.freshchat.com/js/widget.js",e.onload=initFreshChat,i.head.appendChild(e))}
            function initiateCall(){initialize(document,"Freshchat-js-sdk")}
            window.addEventListener?window.addEventListener("load",initiateCall,!1):
            window.attachEvent("load",initiateCall,!1);
            `
          }}
        />
      </body>
    </Html>
  );
}
