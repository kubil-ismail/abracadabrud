import ReactPlayer from 'react-player/youtube';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { setModal } from 'core/redux/reducers/modalSlice';
import { useTranslation } from 'react-i18next';

export default function HowToSubmitVideo() {
  const { isAuthenticated } = useSelector((state) => state.authentication);
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();
  const handleClick = () => {
    if (isAuthenticated) {
      router.push('/uploads');
    } else {
      dispatch(setModal({ name: 'modalLogin', value: true }));
    }
  };
  return (
    <div className="flex flex-col space-y-5 break-words" id="submit-video">
      <div className="px-4 md:px-8 py-8 bg-[#0000FF] rounded-[20px] flex flex-col space-y-7">
        <div className="flex flex-col md:grid md:grid-cols-2 md:items-center space-y-5">
          <img
            src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/submit-video.png`}
            alt="submit-video"
            className="w-full md:w-96 rounded-xl"
          />
          <div className="flex flex-col space-y-5 max-w-lg md:m-auto">
            <h3 className="font-extrabold text-[#23FF2C] text-4xl md:text-[40px]">
              {t('How to submit a video?')}
            </h3>
            <div className="flex flex-col space-y-3">
              <h3 className="font-normal text-xl text-slate-50">
                {t(
                  "It's simple. Upload your performance video to your YouTube channel. Copy and paste the video link from YouTube into the video upload form"
                )}{' '}
                <span className="underline" aria-hidden onClick={handleClick}>
                  {t('here.')}
                </span>
              </h3>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-7 relative break-words">
        {/* <div className="absolute top-14 left-8">
          <h3 className="text-xl md:text-4xl font-extrabold w-3/4 uppercase drop-shadow-3xl">
            {t('HOW TO SUBMIT A VIDEO')}
          </h3>
        </div> */}
        <figure className="">
          <div className="aspect-video w-full xs:h-[196px] sm:h-[320px] md:h-[460px] rounded-[20px]">
            <ReactPlayer
              url="https://youtu.be/JCN-2Hrnemw"
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
    </div>
  );
}
