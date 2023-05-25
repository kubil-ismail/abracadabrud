/** @type {import('next').NextConfig} */
// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.NODE_ENV === 'production' || true
// });

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: true
});

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true
  },
  i18n: {
    locales: ['en', 'id'],
    defaultLocale: 'id'
  },
  images: {
    domains: [
      'via.placeholder.com',
      'localhost',
      'admin.ooooo.id',
      'i.ytimg.com',
      'general-abracadabra.s3.ap-southeast-1.amazonaws.com',
      'admin.abracadabra.events',
      'abracadabra.events',
      'abracadabra-git-development-firmanmardiyanto.vercel.app',
      'staging.cms.abracadabra-starquest.events',
      'dev.cms.abracadabra-starquest.events',
      'd15lge196g4aho.cloudfront.net',
    ]
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
};

// module.exports = withBundleAnalyzer(nextConfig);

module.exports = withPWA(nextConfig);
