import { useState } from 'react';
import EngagementInfo from './EngagementInfo';
import ProfileUser from './ProfileUser';
import Link from 'next/link';
export default function SocialLinks({ name, data }) {
  return (
    <div className="container flex flex-col gap-3">
      <h3 className="text-lg font-bold">{`${name}’s Social Links`}</h3>
      <div className="flex flex-col gap-4">
        {data?.instagram && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
              <img src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/Instagram-logo.svg`} alt="" className="w-4" />
            </div>
            <Link
              href={`https://instagram.com/${data?.instagram}`}
              target="_blank"
            >
              <span className="text-sm font-light">Instagram.com/{data?.instagram}</span>
            </Link>
          </div>
        )}
        {data?.facebook && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
              <img src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/facebook-logo.png`} alt="" className="w-4" />
            </div>
            <Link
              href={`https://facebook.com/${data?.facebook}`}
              target="_blank"
            >
              <span className="text-sm font-light">Facebook.com/{data?.facebook}</span>
            </Link>
          </div>
        )}
        {data?.tiktok && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
              <img src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/tiktok-logos.svg`} alt="" className="w-4" />
            </div>
            <Link
              href={`https://tiktok.com/@${data?.tiktok.replace('@', '')}`}
              target="_blank"
            >
              <span className="text-sm font-light">Tiktok.com/@{data?.tiktok.replace('@', '')}</span>
            </Link>
          </div>
        )}
        {data?.twitter && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
              <img src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/twitter-logos.png`} alt="" className="w-4" />
            </div>
            <Link
              href={`https://twitter.com/${data?.twitter}`}
              target="_blank"
            >
              <span className="text-sm font-light">Twitter.com/{data?.twitter}</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
