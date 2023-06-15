import { useTranslation } from 'react-i18next';
import ReactPlayer from 'react-player/youtube';

export default function EveryWeekWinner() {
  const { t } = useTranslation();
  return (
    <div className="relative bg-[#0000FF] py-8 px-4 rounded-[20px] break-words">
        <div className="flex flex-col md:grid md:grid-cols-2 md:items-center space-y-5">
            <div className="flex-0">
                <img src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/winner.png`} alt="podium-icon" className="w-full md:h-[480px]" />
            </div>
            <div className="flex-1 flex flex-col space-y-4 max-w-md m-auto">
            <h3 className="m-0 font-extrabold text-[#23FF2C] w-3/4 mx-auto text-center text-[36px]">{t('Every week there are 2 winners.')}</h3>
            <div className="flex flex-col space-y-8">
            <div className="flex flex-col space-y-3">
                <span className="text-center text-slate-50 font-bold text-lg">{t('The weekly lucky draw winner!')}</span>
                <p className="text-center text-slate-50 font-normal text-lg">{t('Everyone can win. Each point you collect will automatically enter you in the weekly lucky draw. The more points you have the greater your chances are to win.')}</p>
            </div>
            <div className="flex flex-col space-y-3">
                <span className="text-center text-slate-50 font-bold text-lg">{t('The weekly most point winner!')}</span>
                <p className="text-center text-slate-50 font-normal text-lg">{t('Collect the most points. Each week the player with the most points wins amazing prizes.')}</p>
            </div>
            </div>
            </div>
        </div>
    </div>
  );
}
