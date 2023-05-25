import { useTranslation } from 'react-i18next';

export default function PerformAtWepop() {
  const { t } = useTranslation();
  return (
    <div className="px-4 md:px-6 py-10 bg-[#FF00FE] rounded-[20px]" style={{ backgroundImage: '' }}>
      <div className="flex flex-col md:flex-row space-y-5">
        <div className="block md:hidden">
          <img

            src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/opening-act.webp`}
            alt="awesome-prizes"
            className="w-full md:w-[420px] m-auto"
          />
        </div>
        <div className="flex flex-col space-y-2 md:max-w-xl md:m-auto">
          <h3 className="text-[#23FF2C] text-[40px] font-extrabold text-center">
            {/* {t('Perform as the opening act at wePOP!')} */}
            {t('Perform at the wePOP concert!')}
          </h3>
          <p className="text-xl font-normal">
            {/* {t('Get the most votes for your music video and win the grand prize... a once-in-a-lifetime opportunity to perform as the opening act at the wePOP concert. Win everything from the weekly prize package above, plus...')} */}
            {t('Upload your music video. Get the most votes for your music video and join your idols on stage.')}
          </p>
          <p className="text-xl font-normal">
            {t('Grand prize includes…')}
          </p>
          <div className="flex flex-col gap-1 text-center mt-5 text-xl">
            <ul className="list-none font-normal text-xl flex flex-col space-y-3 w-full">
              <li className="font-bold">{t('Rp.100,000,000 cash!')}</li>
              <li>
                {/* {t('Professional photo session with Afgan, Rizky Febian, BCL, dan Kahitna.')} */}
                {t('plus a Rp. 25,000,000 scholarship to a top music school.')}
                </li>
              <li>
                {/* {t('Accommodation and round-trip transport from anywhere in Indonesia for you and/or your band.')} */}
                {t('Accommodation and round-trip transport from anywhere in Indonesia for you and your band.')}
              </li>
            </ul>
          </div>
        </div>
        <div className="hidden md:block">
          <img
            src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/opening-act.webp`}
            alt="awesome-prizes"
            className="w-full md:w-[420px] m-auto"
          />
        </div>
      </div>
    </div>
  );
}
