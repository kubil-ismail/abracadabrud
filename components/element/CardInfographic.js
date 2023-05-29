import Image from 'next/image';
import { useRouter } from 'next/router';
import { use, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import ModalShare from './modal/ModalShare';
import service from 'core/services/publicService';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import ReactPlayer from 'react-player';
import Link from 'next/link';
import { setCredentials } from 'core/redux/reducers/authenticationSlice';
import parse from 'html-react-parser';

export default function CardInfographic() {
  const [isHidden, setIsHidden] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const { basePath } = useRouter();
  const { isAuthenticated, user } = useSelector((state) => state.authentication);
  const [url, setUrl] = useState('');
  const { t } = useTranslation();
  const [type, setType] = useState('');
  const [data, setData] = useState({});
  const dispatch = useDispatch();
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

  useEffect(() => {
    if (!getCookie('ftv_view')) {
      service
        .get(`${process.env.NEXT_PUBLIC_SITE_URL}/api/ftv`)
        .then((res) => {
          setType(res?.type);
          setData(res?.data);
          setIsHidden(false);
          setCookie('ftv_view', true)
        })
        .catch(() => {
          setIsHidden(true);
        });
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      deleteCookie('ftv_view');
      if (user?.ftv_view === 0) {
        service
          .get(`${process.env.NEXT_PUBLIC_SITE_URL}/api/ftv`)
          .then((res) => {
            setType(res?.type);
            setData(res?.data);
            setIsHidden(false);
            setCookie('ftv_view', true)
          })
          .catch(() => {
            setIsHidden(true);
          });

        service
          .post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/set-ftv`)
          .then((res) => {
            setCookie('ftv_view', true)
            dispatch(setCredentials(res?.data));
          })
          .catch(() => {
            setIsHidden(true);
          });
      } else {
        setIsHidden(true);
      }
    }
  }, [isAuthenticated]);

  const [isMobileDevice, setIsMobileDevice] = useState(false);
  // on resize
  const handleResize = () => {
    if (window.innerWidth < 768) {
      setIsMobileDevice(true);
    } else {
      setIsMobileDevice(false);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <div
        className={
          isHidden
            ? 'hidden'
            : 'rounded-[23px] overflow-hidden py-7 m-auto relative mx-auto'
        }>
        <div className="flex justify-end mb-2">
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
        {type === 'youtube_video' && (
          <ReactPlayer
            url={data?.content}
            playing={true}
          />
        )}

        {type === 'file' && (
          <Link
            href={data?.target_url}
            target="_blank">
            <img
              src={isMobileDevice ? data?.content?.mobile_image : data?.content?.desktop_image}
              style={{
                objectFit: 'contain',
                objectPosition: 'center',
                height: '100%',
                width: '100%'
              }}
            />
            {showShareModal && (
              <ModalShare
                text={shareText}
                url={url}
                quote={shareText}
                onHide={() => setShowShareModal(false)}
              />
            )}
          </Link >
        )}

        {type === 'text_editor' && (
          <div className="flex justify-end mb-2 relative mx-auto px-4 py-2">
            {parse(data?.content)}
          </div>
        )}
      </div>
    </>
  );
}
