import { useState } from 'react';
import Image from 'next/image';

export default function PhotoProfile({
  image,
  styles,
  verfiedPosition,
  verifiedSize,
  isActiveMemberships
}) {
  const [src, setSrc] = useState(image);

  return (
    <div className="relative flex flex-col gap-2 ">
      <Image
        alt="Profile"
        className={`${styles} rounded-full object-cover object-center`}
        src={src ?? image}
        width={50}
        height={50}
        quality={100}
        blurDataURL="/assets/images/user.png"
        onError={() => setSrc('/assets/images/user.png')}
      />
      {isActiveMemberships && (
        <div className="absolute bottom-1 -right-1">
          <img
            src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/verified.png`}
            alt="verified"
            className="w-4"
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
}
