import { useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { useTranslation } from 'react-i18next';
import ReactPlayer from 'react-player/youtube';

export default function ReactionVideo() {
  const { t } = useTranslation();
  const [video, setVideo] = useState([]);
  const listVideo = [
    {
      id: 1,
      link: 'https://youtu.be/ufanWw5vAuQ',
      title: "Isn't she lovely - cover",
      username: 'Jade Warens',
      totalLike: 1200,
      totalComment: 90,
      totalVote: 700
    }
  ];

  useEffect(() => {
    setVideo(listVideo);
  }, []);

  return (
    <div className="flex flex-col space-y-5 text-slate-50 mt-5">
      {video.map((data) => (
        <div className="flex flex-col space-y-5 mb-[20px]" key={data.id}>
          <h3 className="text-lg md:text-2xl font-bold">{t('Reaction Winner Video')}</h3>
          <div className="relative w-full h-[198px] md:h-[240px] rounded-[16px] overflow-hidden">
            <div className="aspect-video h-full md:m-auto">
              <ReactPlayer
                url={data.link}
                width="100%"
                height="100%"
                className="w-full h-full relative"
                light
                playing
              />
            </div>
            {/* <img src="/assets/images/banner-img.png" alt="" className="w-full h-full object-cover object-center" /> */}
          </div>
          <div className="absolute top-3 right-3">
            <div className="w-8 h-8 bg-white flex items-center justify-center">
              <AiOutlineClose className="text-zinc-900" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
