import { useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import ReactPlayer from 'react-player/youtube';

export default function SponsorVideo() {
  const [video, setVideo] = useState([]);
  const listVideo = [
    {
      id: 1,
      link: 'https://youtu.be/NZ-dAiK8h0k',
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

  if (video.length > 0) {
    return (
      <div className="flex flex-col gap-5 text-slate-50 mt-2">
        {video.map((data) => (
          <div className="flex flex-col gap-5 mb-[20px]" key={data.id}>
            <h3 className="text-lg font-bold">Sponsor Video</h3>
            <div className="relative w-full rounded-[16px] overflow-hidden">
              <div className="aspect-video">
                <ReactPlayer
                  url={data.link}
                  width="100%"
                  height="100%"
                  className="w-full h-full relative"
                  light
                  playing
                />
              </div>
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

  return null;
}
