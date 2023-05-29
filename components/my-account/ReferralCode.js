import { Disclosure } from '@headlessui/react';
import ModalShare from 'components/element/modal/ModalShare';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { encryptId } from 'lib/Aes.v2';

export default function ReferralCode() {
  const [url, setUrl] = useState('');
  const { basePath } = useRouter();
  const { t } = useTranslation();
  const [modalShow, setModalShow] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.authentication);
  


  //     shareWithNavigator({
  //       title: `Hey,

  // Check out abracadabra, a cool new music platform where Indonesian performers are competing to perform as the opening act at the wePOP concert. You can upload your music video, vote for other videos, and win amazing prizes. 

  // Prizes include cash, free concert tickets, travel and accommodation, backstage tours, meet ‘n greet, selfies with the headline artists, and more! 

  // Register using this link ${window.location.origin}/referral/${user?.my_referal_code} now!`
  //     });

  const handleShare = () => {
    setModalShow(true);
  }

  const shareText = `Hey,

  Check out abracadabra, a cool new music platform where Indonesian performers are competing to perform as the opening act at the wePOP concert. You can upload your music video, vote for other videos, and win amazing prizes. 
  
  Prizes include cash, free concert tickets, travel and accommodation, backstage tours, meet ‘n greet, selfies with the headline artists, and more! 
  
  Register now!`

  useEffect(() => {
    if (user && isAuthenticated) {
      setUrl(
        `${window.location.origin}${basePath}/referral/${encryptId(
          user?.my_referal_code.replace('ACADABRA0', '')
        )}`
      );
    }
  }, [user]);

  return (
    <Disclosure>
      {({ open }) => (
        <div>
          <Disclosure.Button className="flex w-full justify-between text-left text-sm font-medium focus:outline-none bg-zinc-800 rounded-md p-3">
            <span className="text-lg text-slate-50 cursor-pointer hover:text-[#FF00CA] transition-all delay-100 ease-in-out font-bold">
              {t('Referral code')}
            </span>
            <Image
              src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/chevron-down.png`}
              alt="chevron"
              width={26}
              height={26}
              className={`${open ? 'rotate-180 transform' : ''}`}
            />
            {/* <IoIosArrowDown
            className={`${open ? 'rotate-180 transform' : ''} h-5 w-5`}
          /> */}
          </Disclosure.Button>
          <Disclosure.Panel className="text-xs sm:text-sm py-8 md:py-10">
            <div className="flex flex-col gap-7 text-slate-50">
              <div className="flex flex-col gap-2">
                {/* <h3 className="text-lg font-bold m-0">{t('Referral Code')}</h3> */}
                <span className="text-base font-bold">
                  {t(`Your Referral Code is :`)}
                  {''} {encryptId(user?.my_referal_code.replace('ACADABRA0', ''))}
                </span>
              </div>
              <div className="">
                <span className="text-sm font-medium">
                  {t(
                    'Share this code with your friends and earn 50 points each time a friend uses it to register for an abracadabra account.'
                  )}
                </span>
              </div>
              <button
                className="flex justify-between items-center w-full py-2"
                onClick={handleShare}>
                <span className="text-sm font-medium">
                  {t('Click here to share your referral codes.')}
                </span>
                <img
                  src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/share-icon.svg`}
                  alt="share-icon"
                  className="w-6"
                  width="100%"
                  height="100%"
                />
              </button>
              {modalShow && (
                <ModalShare
                  url={url}
                  text={shareText}
                  quote={shareText}
                  onHide={() => setModalShow(false)}
                />
              )}
            </div>
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
}
