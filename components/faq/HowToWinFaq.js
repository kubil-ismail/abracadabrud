import { useTranslation } from 'react-i18next';

export default function HowToWinFaq() {
  const { t } = useTranslation();
  return (
    <div className="px-4 py-8 bg-[#0000FF] rounded-[20px] break-words" id="how-to-win">
      <div className="flex flex-col space-y-6">
        <h3 className="text-[48px] font-extrabold text-[#23FF2C] text-center">{t('How to win!')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 md:items-center space-y-5">
          <div className="">
            <img
              src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/wld-htp-2.png`}
              alt="wld-htp"
              className="w-full md:w-[360px] m-auto"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <h3 className="font-extrabold text-[32px] md:text-left">
              {t('Weekly Lucky Draw')}
            </h3>
            <span className="text-base md:text-lg font-normal md:w-[70%]">
              {t('Each point you collect will automatically enter you in the weekly lucky draw. The more points you have the greater your chances are to win.')}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 md:items-center gap-5">
          <div className="block md:hidden">
            <img
              src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/pdm-htp+2.png`}
              alt="pdm-htp"
              className="w-full md:w-[360px] m-auto"
            />
          </div>
          <div className="flex flex-col space-y-2 max-w-2xl">
            <h3 className="font-extrabold text-[32px] md:w-[70%] md:ml-28">
              {t('Collect the most points')}
            </h3>
            <span className="text-base md:text-lg font-normal md:w-[70%] md:ml-28">
              {t('Each week the player with the most points wins.')}
            </span>
          </div>
          <div className="hidden md:block">
            <img
              src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/pdm-htp+2.png`}
              alt="pdm-htp"
              className="w-full md:w-[360px] m-auto"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 md:items-center gap-5">
          <div className="">
            <img
              src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/thumb.png`} 
              alt="thumbs"
              className="w-full md:w-[360px] m-auto"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <h3 className="font-extrabold text-[32px]">
              {t('Vote for the winning video')}
            </h3>
            <span className="text-base md:text-lg font-normal md:w-[70%]">
              {t('Each vote for the winning video will enter you into another lucky draw. This lucky draw winner will be announced along with the winning video at the end of the competition.')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
