import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function HowToWin() {
  const { t } = useTranslation();
  return (
    <div className="px-4 py-8 bg-[#0000FF] rounded-[20px] break-words" id="how-to-win">
      <div className="flex flex-col space-y-6">
        <h3 className="text-[48px] font-extrabold text-[#23FF2C] text-center">
          {t('How to win!')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 md:items-center space-y-5">
          <div className="">
            <img
              src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/wld-htp-2.png`}
              alt="wld-htp"
              className="w-full md:w-[360px] m-auto"
            />
          </div>
          <div className="flex flex-col space-y-3">
            <h3 className="font-extrabold text-[32px] text-center md:text-left">
              {t('Collect More Points')}
            </h3>
            <span className="text-base md:text-lg font-normal md:w-[70%]">
              {t(
                'Each point you collect will automatically enter you in the weekly lucky draw. The more points you have the greater your chances are to win. The player with the most points also wins.'
              )}
            </span>
            <span className="mt-4 text-lg md:text-xl font-semibold w-full md:w-[80%]">
              {t('Find out how to get more points')}{' '}
              <Link href="/faq">
                <span className="underline">{t('here.')}</span>
              </Link>
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 md:items-center space-y-5">
          <div className="block md:hidden">
            <img
              src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/pdm-htp+2.png`}
              alt="thumbs"
              className="w-full md:w-[360px] m-auto"
            />
          </div>
          <div className="flex flex-col space-y-3 max-w-2xl m-auto">
            <h3 className="font-extrabold text-[32px] md:w-[70%] md:m-auto">
              {t('Vote for the winner')}
            </h3>
            <span className="text-base md:text-lg font-normal md:w-[70%] md:m-auto">
              {t(
                'Each vote for the winning video will enter you into the lucky draw. The lucky draw winner will be announced along with the winning video at the end of the competition.'
              )}
            </span>
          </div>
          <div className="hidden md:block">
            <img
              src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/pdm-htp+2.png`}
              alt="thumbs"
              className="w-full md:w-[360px] m-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
