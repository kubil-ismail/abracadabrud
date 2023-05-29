import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { setModal } from 'core/redux/reducers/modalSlice';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import ModalShare from 'components/element/modal/ModalShare';

export default function WaysGetPoint() {
  const { t } = useTranslation();
  const router = useRouter();
  const { basePath } = useRouter();
  const dispatch = useDispatch();
  const [showShareModal, setShowShareModal] = useState(false);
  const [url, setUrl] = useState('');
  const { isAuthenticated, user } = useSelector((state) => state.authentication);


  useEffect(() => {
    if (router.pathname === '/faq#ways-get-point') {
      document.getElementById('ways-get-point').scrollIntoView();
    }
  }, [router.pathname]);

  useEffect(() => {
    if (user && isAuthenticated) {
      setUrl(`${window.location.origin}${basePath}/referral/${user?.my_referal_code}`);
    } else {
      setUrl(`${window.location.origin}${basePath}`);
    }
  }, [user]);

  const shareText = `Hey,

  Check out abracadabra, a cool new music platform where Indonesian performers are competing to perform as the opening act at the wePOP concert. You can upload your music video, vote for other videos, and win amazing prizes. 
  
  Prizes include cash, free concert tickets, travel and accommodation, backstage tours, meet ‘n greet, selfies with the headline artists, and more! 
  
  Register now!`;


  return (
    <div className="px-7 md:px-10 py-10 rounded-2xl bg-[#FF00FE] flex flex-col space-y-5 break-words">
      <h3 className="text-4xl  md:text-5xl font-black text-[#23FF2C]">
        {t('6 ways to collect more points!')}
      </h3>
      <div className="px-2 flex flex-col space-y-4 md:gap-8 md:max-w-5xl md:m-auto">
      {showShareModal && (
        <ModalShare
          text={shareText}
          url={url}
          quote={shareText}
          onHide={() => setShowShareModal(false)}
        />
      )}
        <div className="grid grid-cols-2 space-y-4">
          <div className="text-right">
            <div className="flex flex-col space-y-2">
              <div className="flex justify-end">
                <div className="font-bold flex items-center space-x-2">
                  <div className="flex-0 text-sm font-bold w-8 h-8 rounded-full bg-[#23FF2C] text-[#0000FF] flex items-center justify-center">
                    1
                  </div>
                  <h3 className="font-extrabold flex-1 md:text-2xl ">{t('Register')}</h3>
                </div>
              </div>
              <span className="font-normal md:text-lg">
                {t('Get 10 points for completing the abracadabra registration process.')}
              </span>
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <img
              src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/regis-faq.png`}
              alt=""
              className="w-48 md:w-64 md:m-auto"
            />
            <button type="button" className={isAuthenticated ? 'hidden' : 'text-sm text-[#23FF2C] font-bold uppercase text-center'} onClick={() => dispatch(setModal({ name: 'modalRegister', value: true }))} >{t('Click Here')}</button>
          </div>
        </div>
        <div className="grid grid-cols-2 space-y-4">
          <div className="flex flex-col space-y-1">
            <img
              src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/faq-ads.png`}
              alt=""
              className="w-48 md:w-64 md:m-auto"
            />
            <button type="button" className="text-sm text-[#23FF2C] font-bold uppercase text-center" onClick={() => router.push('/sponsor')} >{t('Click Here')}</button>
          </div>
          <div className="">
            <div className="flex flex-col space-y-2">
              <div className="flex">
                <div className="font-bold flex items-center space-x-2">
                  <div className="flex-0 text-sm font-bold w-8 h-8 rounded-full bg-[#23FF2C] text-[#0000FF] flex items-center justify-center">
                    2
                  </div>
                  <h3 className="font-extrabold flex-1 md:text-2xl ">{t('Watch Sponsor’s Video Daily')}</h3>
                </div>
              </div>
              <span className="font-normal md:text-xl">
                {t(
                  'Get 5 points for every sponsor video you watch.'
                )}
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 space-y-3">
          <div className="text-right">
            <div className="flex flex-col space-y-2">
              <div className="flex justify-end">
                <div className="font-bold flex items-center space-x-2">
                  <div className="flex-0 text-sm font-bold w-8 h-8 rounded-full bg-[#23FF2C] text-[#0000FF] flex items-center justify-center">
                    3
                  </div>
                  <h3 className="font-extrabold flex-1 md:text-2xl">{t('Referrals')}</h3>
                </div>
              </div>
              <span className="font-normal md:text-xl">
                {t(
                  'Get 50 points for you and 25 for your friend, when a friend uses your referral link to register an abracadabra account.'
                )}
              </span>
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <img
              src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/faq-ref.png`}
              alt=""
              className="w-48 md:w-64 md:m-auto"
            />
            <button type="button" className="text-sm text-[#23FF2C] font-bold uppercase text-center" onClick={() => setShowShareModal(true)} >{t('Click Here')}</button>
          </div>
        </div>
        <div className="grid grid-cols-2 space-y-3">
          <div className="flex flex-col space-y-1">
            <img
              src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/faq-cp.png`}
              alt=""
              className="w-48 md:w-64 md:m-auto"
            />
              <button type="button" className="text-sm text-[#23FF2C] font-bold uppercase text-center" onClick={() => router.push('/my-account/#completeProfile')}>{t('Click Here')}</button>
          </div>
          <div className="">
            <div className="flex flex-col space-y-2">
              <div className="flex">
                <div className="font-bold flex items-center space-x-2">
                  <div className="flex-0 text-sm font-bold w-8 h-8 rounded-full bg-[#23FF2C] text-[#0000FF] flex items-center justify-center">
                    4
                  </div>
                  <h3 className="font-extrabold flex-1 md:text-2xl ">
                    {t('Complete Profile')}
                  </h3>
                </div>
              </div>
              <span className="font-normal md:text-xl ">
                {t('Get 30 points after completing the additional information section of your profile.')}
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 space-y-2">
          <div className="text-right">
            <div className="flex flex-col space-y-2">
              <div className="flex justify-end">
                <div className="font-bold flex items-center space-x-2">
                  <div className="flex-0 text-sm font-bold w-8 h-8 rounded-full bg-[#23FF2C] text-[#0000FF] flex items-center justify-center">
                    5
                  </div>
                  <h3 className="font-extrabold flex-1 md:text-2xl ">
                    {t('Complete Survey Questions')}
                  </h3>
                </div>
              </div>
              <span className="font-normal md:text-xl ">
                {t('Get 30 points for completing survey questions on “Survey Question” page')}
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <img
              src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/faq-survey.png`}
              alt=""
              className="w-48 md:w-64 md:m-auto"
            />
                        <button type="button" className="text-sm text-[#23FF2C] font-bold uppercase text-center" onClick={() => isAuthenticated ? router.push('/survey-question') :  dispatch(setModal({ name: 'modalLogin', value: true })) } >{t('Click Here')}</button>
          </div>
        </div>
        <div className="grid grid-cols-2 space-y-2">
          <div className="flex flex-col space-y-1">
            <img
              src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/faq-upgrade.png`}
              alt=""
              className="w-48 md:w-64 md:m-auto"
            />
                        <button type="button" className="text-sm text-[#23FF2C] font-bold uppercase text-center" onClick={() => router.push('/faq/#memberships')} >{t('Click Here')}</button>
          </div>
          <div className="">
            <div className="flex flex-col space-y-2">
              <div className="flex">
                <div className="font-bold flex items-center space-x-2">
                  <div className="flex-0 text-sm font-bold w-8 h-8 rounded-full bg-[#23FF2C] text-[#0000FF] flex items-center justify-center">
                    6
                  </div>
                  <h3 className="flex-1 font-extrabold md:text-2xl ">{t('Upgrade Your Membership')}</h3>
                </div>
              </div>
              <span className="font-normal md:text-xl ">
                {t('Enjoy backstage access online and receive 500 extra points to vote for your favorite videos.')}
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 space-y-2">
          <div className="text-right">
            <div className="flex flex-col space-y-2">
              <div className="flex justify-end">
                <div className="font-bold flex items-center space-x-2">
                  <div className="flex-0 text-sm font-bold w-8 h-8 rounded-full bg-[#23FF2C] text-[#0000FF] flex items-center justify-center">
                    7
                  </div>
                  <h3 className="font-extrabold flex-1 md:text-2xl ">
                    {t('Purchase more points')}
                  </h3>
                </div>
              </div>
              <span className="font-normal md:text-xl ">
                {t('Buy 500 points for only Rp 29,900.')}
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <img
              src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/more-chances.png`}
              alt=""
              className="w-48 md:w-64 md:m-auto"
            />
                        <button type="button" className="text-sm text-[#23FF2C] font-bold uppercase text-center" onClick={() => router.push('/faq/#extra_points')}>{t('Click Here')}</button>
          </div>
        </div>
        {/* <div className="grid grid-cols-2 gap-3">
                    <div className="text-right">
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-end">
                                <div className="font-bold flex items-center gap-2">
                                    <div className="flex-0 text-sm font-bold w-8 h-8 rounded-full bg-[#23FF2C] text-[#0000FF] flex items-center justify-center">
                                        7
                                    </div>
                                    <h3 className="flex-1 font-extrabold md:text-2xl ">Upload a video </h3>
                                </div>
                            </div>
                            <span className="font-semibold md:text-xl ">Get 200 points by uploading a video.</span>
                        </div>
                    </div>
                    <div className="">
                        <img src="/assets/images/upload-faq.png" alt="" className="w-48 md:w-64 md:m-auto" />
                    </div>
                </div> */}
      </div>
    </div>
  );
}
