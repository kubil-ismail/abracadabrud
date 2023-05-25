import { useTranslation } from 'react-i18next';
import ReactPlayer from 'react-player/youtube';

export default function UsePointToVote() {
  const { t } = useTranslation();
  return (
    <div className="relative bg-[#23FF2C] py-8 px-4 rounded-[20px] break-words">
        <div className="flex flex-col md:grid md:grid-cols-2 md:items-center space-y-5">
            <div className="flex-0 block md:hidden">
                <img src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/pdm-htp+2.png`} alt="podium-icon" className="w-full md:h-[440px]" />
            </div>
            <div className="flex-1 flex flex-col space-y-4 md:space-y-6 max-w-xl md:m-auto">
            <h3 className="m-0 font-extrabold text-slate-50 w-3/4 mx-auto text-center text-[48px]">{t('Use your points to vote!')}</h3>
            <p className="text-lg font-normal text-[#0000FF] text-center md:max-w-sm md:m-auto">{t('Each vote for the winning video automatically enters you into an extra lucky draw.')}</p>
            <p className="text-lg font-normal text-[#0000FF] text-center md:max-w-sm md:m-auto">{t('The extra lucky draw winner will be announced along with the winning video at the end of the competition.')}</p>
            </div>
            <div className="flex-0 hidden md:block">
                <img src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/pdm-htp+2.png`} alt="podium-icon" className="w-full md:h-[440px]" />
            </div>
        </div>
    </div>
  );
}
