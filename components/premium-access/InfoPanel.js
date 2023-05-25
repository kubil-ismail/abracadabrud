import ReactPlayer from 'react-player/youtube';

export default function InfoPanel() {
  return (
    <div className="flex flex-col gap-7" id="collect-votes">
      <figure className="">
        <div className="aspect-video md:w-full md:h-[460px] rounded-[20px]">
          <ReactPlayer
            url="https://youtu.be/JCN-2Hrnemw"
            width="100%"
            height="100%"
            light={true}
            controls
            playing
            playsinline
            className="w-full h-full rounded-[20px] overflow-hidden"
          />
        </div>
      </figure>
    </div>
  );
}
