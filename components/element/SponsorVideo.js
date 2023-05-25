import ReactPlayer from 'react-player/youtube';

export default function SponsorVideo({ video }) {
  return (
    <div className="flex flex-col gap-7 relative" id="collect-votes">
      <div className="absolute bottom-4 left-4">
        <h3 className="text-base font-extrabold w-3/4">Watch sponsor video and earn 5 points</h3>
      </div>
      <button type="button" className="absolute bottom-4 right-4">
        <img src="/assets/icons/share-icons.png" alt="share" className="w-6" />
      </button>
      <figure className="">
        <div className="aspect-video rounded-[20px]">
          <ReactPlayer
            url={video}
            width="100%"
            height="100%"
            light={true}
            controls
            playing
            className="w-full h-full rounded-[20px] overflow-hidden"
          />
        </div>
      </figure>
    </div>
  );
}
