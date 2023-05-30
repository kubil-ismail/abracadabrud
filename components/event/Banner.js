import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import ModalShare from 'components/element/modal/ModalShare';
import { encryptId } from 'lib/Aes.v2';

export default function BannerEvent() {
  const { basePath, asPath, push } = useRouter();
  const [modalShareShow, setModalShareShow] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.authentication);
  const [url, setUrl] = useState('');
  const [isEvent, setIsEvent] = useState(false);
  const { allEvents: dataEvents } = useSelector((state) => state.global);

  const [width, setWidth] = useState();

  const isMobile = width <= 768;

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    setWidth(window.innerWidth);
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  useEffect(() => {
    if (user && isAuthenticated) {
      setUrl(
        `${window.location.origin}${basePath}/referral/${encryptId(
          user?.my_referal_code.replace('ACADABRA0', '')
        )}`
      );
    } else {
      setUrl(`${window.location.origin}${basePath}`);
    }
  }, [user]);

  console.log('dataEvents', dataEvents);
  useEffect(() => {
    if (asPath === '/event') {
      setIsEvent(true);
    } else {
      setIsEvent(false);
    }
  }, [asPath]);

  const shareText = `Hey,

  Check out abracadabra, a cool new music platform where Indonesian performers are competing to perform as the opening act at the wePOP concert. You can upload your music video, vote for other videos, and win amazing prizes. 
  
  Prizes include cash, free concert tickets, travel and accommodation, backstage tours, meet ‘n greet, selfies with the headline artists, and more! 
  
  Register now!`;

  return dataEvents?.data?.data?.length > 0 || dataEvents?.last_event ? (
    <>
      <div className="container overflow-hidden">
        {modalShareShow && (
          <ModalShare
            text={shareText}
            url={url}
            quote={shareText}
            onHide={() => setModalShareShow(false)}
          />
        )}
        <div className="flex flex-col space-y-3 relative">
          {dataEvents?.data?.data.length > 0 ? (
            <img
              src={`${dataEvents?.data?.data.length > 0
                ? isMobile
                  ? isEvent
                    ? dataEvents?.data?.data[0]?.image_banner
                    : dataEvents?.data?.data[0]?.image || dataEvents?.last_event?.image
                  : dataEvents?.data?.data[0]?.video_banner ||
                  dataEvents?.last_event?.video_banner
                : isMobile
                  ? dataEvents?.last_event?.image_banner || dataEvents?.last_event?.image
                  : dataEvents?.last_event?.video_banner
                }`}
              alt="banner-event"
              className={`w-full object-cover object-center rounded-[20px] ${!isEvent ? 'cursor-pointer' : ''
                }`}
              width="100%"
              height="100%"
              style={{ backgroundColor: '#55607F' }}
              onClick={() => {
                if (!isEvent) {
                  push('/event');
                }
              }}
            />
          ) : (
            <img
              src={`${isMobile ? dataEvents?.last_event?.image : dataEvents?.last_event?.video_banner
                }`}
              alt="banner-event"
              className={`w-full object-cover object-center rounded-[20px] ${!isEvent ? 'cursor-pointer' : ''
                }`}
              width="100%"
              height="100%"
              style={{ backgroundColor: '#55607F' }}
              onClick={() => {
                if (!isEvent) {
                  push('/event');
                }
              }}
            />
          )}
          <button
            type="button"
            className="absolute bottom-4 md:bottom-6 right-6"
            onClick={() => setModalShareShow(true)}>
            <img
              src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/share-icon.svg`}
              alt="share-icon"
              className="w-6"
              loading="lazy"
              width="100%"
              height="100%"
              style={{
                filter: 'drop-shadow(0px 0px 2px rgb(0 0 0 / 0.7))'
              }}
            />
          </button>
          {/* <button type="button" className="absolute bottom-3 md:bottom-4 right-6 flex items-center justify-center bg-zinc-900/50 px-2 py-1.5 rounded-full" onClick={() => setModalShareShow(true)}>
          <img src="/assets/icons/share-icons.png" alt="share" className="w-6" />
        </button> */}
        </div>
      </div>
    </>
  ) : null;
}
