import { useState } from 'react';

export default function SponsorLogo() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
      <img src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/oreo-logo.png`} alt="" className="w-32 md:w-56 m-auto" />
      <img src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/kfc-logo.png`} alt="" className="w-32 md:w-56 m-auto" />
      <img src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/coca-cola-logo.png`} alt="" className="w-32 md:w-56 m-auto" />
      <img src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/nestle-logo.png`} alt="" className="w-32 md:w-56 m-auto" />
    </div>
  );
}
