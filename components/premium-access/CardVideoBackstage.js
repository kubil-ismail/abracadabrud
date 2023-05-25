import ReactPlayer from 'react-player/youtube';

export default function CardVideoBackstage({ data }) {
  return (
    <div className="w-full md:max-w-2xl md:m-auto flex flex-col gap-7 relative" id="collect-votes">
      <div className="absolute top-8 left-8">
        <h3 className="text-xl md:text-4xl font-extrabold">{data?.data?.title}</h3>
      </div>
      <figure className="">
        <div className="aspect-video md:w-full md:h-[460px] rounded-[20px]">
          <ReactPlayer
            url={data?.data?.video_link}
            width="100%"
            height="100%"
            light
            controls
            playing
            className="w-full h-full rounded-[20px] overflow-hidden"
          />
        </div>
      </figure>
    </div>
  );
}
