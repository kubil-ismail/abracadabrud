import { useTranslation } from 'react-i18next';
import ReactPlayer from 'react-player/youtube';

export default function HowToCollectPoint() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-7 relative break-words" id="collect-votes">
      {/* <div className="absolute top-12 left-8">
        <h3 className="text-xl md:text-4xl font-extrabold w-3/4 drop-shadow-3xl">{t('HOW TO COLLECT POINTS AND VOTE')}</h3>
      </div> */}
      <figure className="">
        <div className="aspect-video w-full xs:h-[196px] sm:h-[320px] md:h-[460px] rounded-[20px]">
          <ReactPlayer
            url="https://youtu.be/RgOuks3__EE"
            width="100%"
            height="100%"
            light={true}
            controls
            className="w-full h-full rounded-[20px] overflow-hidden"
          />
        </div>
        <div className='h-4' id="ways-get-point" style={{ marginTop: '-1rem' }} />
      </figure>
    </div>
  );
}
