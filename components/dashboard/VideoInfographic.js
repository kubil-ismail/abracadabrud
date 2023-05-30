import ModalShare from 'components/element/modal/ModalShare';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import ReactPlayer from 'react-player/youtube';
import { encryptId } from 'lib/Aes.v2';

export default function VideoInfographic() {
  const { t } = useTranslation();
  const { basePath } = useRouter();
  const [modalShareShow, setModalShareShow] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.authentication);
  const [url, setUrl] = useState('');
  const shareText = `Hey,

  Check out abracadabra, a cool new music platform where Indonesian performers are competing to perform as the opening act at the wePOP concert. You can upload your music video, vote for other videos, and win amazing prizes. 
  
  Prizes include cash, free concert tickets, travel and accommodation, backstage tours, meet ‘n greet, selfies with the headline artists, and more! 
  
  Register now!`;

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

  return (
    <div>
      {modalShareShow && (
        <ModalShare
          text={shareText}
          quote={shareText}
          url={url}
          onHide={() => setModalShareShow(false)}
        />
      )}
      <div
        // className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-7 grid-flow-row h-full"
        className="container md:flex md:items-center md:justify-center h-full w-full md:max-w-xl md:m-auto"
        id="collect-votes">
        {/* <div className="absolute top-6 left-6">
        <h3 className="text-xl md:text-4xl font-extrabold w-3/4">HOW TO COLLECT POINTS AND VOTE</h3>
      </div> */}
        <div className="flex flex-col h-full relative overflow-hidden">
          <div className="aspect-video w-full rounded-t-[16px]">
            <ReactPlayer
              url="https://youtu.be/RgOuks3__EE"
              width="100%"
              height="100%"
              light={true}
              controls
              playing
              className="aspect-video rounded-t-[16px] overflow-hidden"
            />
          </div>
          <div className="bg-zinc-800 p-4 md:p-5 flex flex-col space-y-1 rounded-b-[16px] h-full">
            <h3 className="text-base md:text-lg font-extrabold w-full uppercase md:w-[90%]">
              {t('How to vote, share and win amazing prizes!')}
            </h3>
            <button
              type="button"
              className="flex justify-end w-full"
              onClick={() => setModalShareShow(true)}>
              <img
                src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/share-icon.svg`}
                alt="share-icon"
                className="w-6"
                width="100%"
                height="100%"
                style={{
                  filter: 'drop-shadow(0px 0px 2px rgb(0 0 0 / 0.7))'
                }}
              />
            </button>
            {/* <p className="text-base font-light flex flex-col space-y-2 md:w-full w-[93%]">
              <span className="text-[14px]">
                {t(
                  'Attend the concert and meet your idol! Airfare and accommodation paid. Backstage tour, and selfies with the artists.'
                )}
              </span>
              <span className="text-[14px]">
                {t(
                  'Join the competition. Watch and vote for your favorite videos, collect points and win!'
                )}
              </span>
              <span className="text-[14px]">
                {t(
                  'Share this video with your friends and earn 5 points for everyone that registered joins the competition.'
                )}
              </span>
            </p> */}
          </div>
        </div>
        {/* <div className="flex flex-col h-full relative">
          <div className="aspect-video rounded-t-[16px]">
            <ReactPlayer
              url="https://youtu.be/JCN-2Hrnemw"
              width="100%"
              height="100%"
              light={true}
              controls
              className="aspect-video rounded-t-[16px] overflow-hidden"
            />
            <button
              type="button"
              className="absolute bottom-3 md:bottom-4 right-6"
              onClick={() => setModalShareShow(true)}>
              <img
                src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/share-icon.svg`}
                alt="share-icon"
                className="w-6"
                width="100%"
                height="100%"
                style={{
                  filter: 'drop-shadow(0px 0px 2px rgb(0 0 0 / 0.7))'
                }}
              />
            </button>
          </div>
          <div className="bg-zinc-800 p-4 md:p-5 flex flex-col space-y-2 rounded-b-[16px] h-full">
            <h3 className="text-base md:text-lg font-extrabold w-full uppercase">
              {t('How to upload video and share with friends!')}
            </h3>
            <p className="text-base font-light flex flex-col space-y-2 md:w-full w-[93%]">
              <span className="text-[14px]">
                {t('Appear onstage as the opening act for your idol!')}
              </span>
              <span className="text-[14px]">
                {t(
                  'Join the competition. Upload your music video. Share with your friends, get the most votes, and win!'
                )}
              </span>
              <span className="text-[14px]">
                {t(
                  'Share this video with your friends and earn 5 points for everyone that registered joins the competition.'
                )}
              </span>
            </p>
          </div>
        </div> */}
      </div>
    </div>
  );
}
