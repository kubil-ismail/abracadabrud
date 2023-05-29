import { useState } from 'react';
import ModalShare from './modal/ModalShare';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { encryptId } from 'lib/Aes.v2';

export default function ButtonShare({ idVideo, artistName, caption, userID }) {
  const { basePath } = useRouter();
  const { isAuthenticated, user } = useSelector((state) => state.authentication);
  const [showModal, setShowModal] = useState(false);
  const [url, setUrl] = useState();
  const shareText = `${artistName} - ${caption}
  Check out my music video! Make sure to vote for it often so I can win the opportunity to perform at the wePOP come together on 6 August 2023.
    
    It's Easy! Click this link, vote for me now, and you too can win amazing weekly prizes:
    THANKS!
    `;
  useEffect(() => {
    if (user && isAuthenticated) {
      setUrl(
        `${window.location.origin}${basePath}/video/${encryptId(idVideo)}?referral=${encryptId(
          user?.my_referal_code.replace('ACADABRA0', '')
        )}`
      );
    } else {
      setUrl(`${window.location.origin}${basePath}/video/${encryptId(idVideo)}`);
    }
  }, [user, idVideo]);

  return (
    <>
      {showModal && (
        <ModalShare
          text={shareText}
          dataUser={user}
          quote={shareText}
          url={url}
          name={artistName}
          captions={caption}
          onHide={() => setShowModal(false)}
          isUser={user?.id === userID}
        />
      )}
      <button type="button" className="text-sm" onClick={() => setShowModal(true)}>
        <div className="cursor-pointer pt-[4px] ">
          <img
            src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/share-icon.svg`}
            alt="share-icon"
            className="w-[16px] flex-0"
            loading="lazy"
            width="100%"
            height="100%"
          />
        </div>
      </button>
    </>
  );
}
