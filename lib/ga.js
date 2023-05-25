import gtag, { install } from 'ga-gtag';

export const GOOGLE_ANALYTICS = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;

export const pageview = (url) => {
  try {
    install(GOOGLE_ANALYTICS, {
      page_path: url
    });
  } catch (e) {
    console.error(e);
  }
};

export const event = ({ action, params }) => {
  try {
    install(GOOGLE_ANALYTICS);
    gtag('event', action, params);
  } catch (e) {
    console.log(e);
  }
};
