import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import ModalShare from './modal/ModalShare';

export default function CardInfographic() {
  const [isHidden, setIsHidden] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const { basePath } = useRouter();
  const { isAuthenticated, user } = useSelector((state) => state.authentication);
  const [url, setUrl] = useState('');
  const { t } = useTranslation();
  const shareText = `Hey,

  Check out abracadabra, a cool new music platform where Indonesian performers are competing to perform as the opening act at the wePOP concert. You can upload your music video, vote for other videos, and win amazing prizes. 
  
  Prizes include cash, free concert tickets, travel and accommodation, backstage tours, meet ‘n greet, selfies with the headline artists, and more! 
  
  Register now!`;
  useEffect(() => {
    if (user && isAuthenticated) {
      setUrl(`${window.location.origin}${basePath}/referral/${user?.my_referal_code}`);
    } else {
      setUrl(`${window.location.origin}${basePath}`);
    }
  }, [user]);

  return (
    <div
      className={
        isHidden
          ? 'hidden bg-cover bg-center'
          : 'bg-[#333338] text-[#D9D9D9] rounded-[23px] overflow-hidden px-5 py-7 m-auto relative max-w-2xl mx-auto'
      }
      style={{
        backgroundImage: `url('${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/ftv.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
      {showShareModal && (
        <ModalShare
          text={shareText}
          url={url}
          quote={shareText}
          onHide={() => setShowShareModal(false)}
        />
      )}
      <div className="flex justify-end mb-4">
        <Image
          src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/close-icon.png`}
          alt="close"
          width={24}
          height={24}
          className="cursor-pointer"
          onClick={() => setIsHidden(true)}
        />
        {/* <RiCloseFill size={32} className="cursor-pointer"  /> */}
      </div>
      <div className="flex flex-col text-center leading-[240%]">
        <h3 className="text-[36px] font-extrabold tracking-[-0.24px] max-w-xl m-auto">
          {t('Vote for your favorite videos and win amazing prizes!')}
          {/* {t('Collect as many points as you can! Use your points to vote for your favorite video and win amazing prizes every week!')} */}
        </h3>
        <div className="text-xl font-normal mt-4 flex flex-col space-y-2 tracking-[-0.24px]">
          <span className="font-light text-base mb-4">
            {t('The weekly prize package includes:')}
          </span>
          <span>{t('2 free VIP concert tickets.')}</span>
          <span>{t('Backstage tour.')}</span>
          <span>{t('Meet ‘n greet and selfies with Judika, Rizky Febian, BCL, and Kahitna.')}</span>
          <span>{t('Accommodation and round-trip transport from anywhere in Indonesia.')}</span>
          <span>
            {t(
              'Upload your music video. Win once in a life time experience to perform together with the stars at the wePOP concert!'
            )}
          </span>
        </div>
        <div className="mt-5 mb-3">
          <Image
            src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/HL_card.png`}
            alt="thropy"
            width={0}
            height={0}
            sizes="50vw"
            style={{ width: '50%', height: 'auto' }}
            quality={100}
            className="w-72 m-auto"
          />
        </div>
        <button
          type="button"
          className="absolute bottom-4 md:bottom-4 right-6"
          onClick={() => setShowShareModal(true)}>
          <img
            src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/share-icon.svg`}
            alt="share"
            className="w-6"
            width="100%"
            height="100%"
            style={{
              filter: 'drop-shadow(0px 0px 2px rgb(0 0 0 / 0.7))'
            }}
          />
        </button>
      </div>
    </div>
  );
}
