import { useDispatch, useSelector } from 'react-redux';
import ReactPlayer from 'react-player/youtube';
import { AiFillCheckCircle } from 'react-icons/ai';
import { useEffect, useState, useRef } from 'react';
import { setSponsorPlayed } from 'core/redux/reducers/globalSlice';
import { setPoint } from 'core/redux/reducers/pointSlice';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import Countdown from 'react-countdown';
import moment from 'moment';
import { GiSpeaker, GiSpeakerOff } from 'react-icons/gi';
import SSServices from 'core/services/ServerSide/ssServices';

export default function SponsorVideo({
  video,
  title,
  playing,
  height,
  id,
  alreadyWatched,
  mode,
  onClickPreview,
  onPlay,
  muted,
  readOnly,
  isImage,
  image,
  heightParent
}) {
  const _countdown = useRef();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { token, isAuthenticated } = useSelector((state) => state.authentication);
  const { sponsorPlaying, allEvents } = useSelector((state) => state.global);
  const [canPlay, setCanPlay] = useState(true);
  const [hasPlay, setHasPlay] = useState(false);
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const [totaDuration, setTotaDuration] = useState(null);
  const [hasSound, setHasSound] = useState(muted ? false : true);
  const [width, setWidth] = useState();

  const isMobile = width <= 768;

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    setCurrentPlaying(null);
  }, []);

  useEffect(() => {
    if (sponsorPlaying?.find((_id) => _id === id)) {
      setHasPlay(true);
    } else {
      setHasPlay(false);
    }
  }, [sponsorPlaying, id, token]);

  // useEffect(() => {
  //   if (readOnly) {
  //     setCanPlay(false);
  //   }
  // }, [readOnly, isAuthenticated]);

  useEffect(() => {
    setWidth(window.innerWidth);
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  return (
    <div
      className={`flex flex-col bg-[#323232] rounded-[20px] relative overflow-hidden grow-0 md:h-[300px]`}>
      <div className="bg-[#C6C6C6] rounded-t-[20px] overflow-hidden aspect-video">
        {isImage ? (
          <div className="w-full rounded-[20px] overflow-hidden">
            <img
              src={isMobile ? image?.mobile : image?.desktop}
              style={{
                objectFit: 'contain',
                objectPosition: 'center',
                height: '100%',
                width: '100%'
              }}
            />
          </div>
        ) : (
          <ReactPlayer
            url={canPlay ? `${video}` : null}
            width="100%"
            height="100%"
            light
            playing={playing}
            // light={playing ? false : true}
            className="w-full h-full"
            // playing={mode === 'feed' ? playing : true}
            onClickPreview={() => {
              onClickPreview();
              setCurrentPlaying(id);
            }}
            onDuration={(res) => setTotaDuration(res)}
            onPlay={() => {
              if (onPlay) onPlay();

              if (currentPlaying) {
                _countdown.current.start();
              } else {
                setCurrentPlaying(id);
              }
            }}
            onPause={() => {
              if (_countdown) _countdown.current.pause();
            }}
            muted={!hasSound}
            onEnded={() => {
              if (token && isAuthenticated && allEvents?.data?.data?.length) {
                if (hasPlay || alreadyWatched) {
                  toast.info(t('user already watched an ads today'));
                } else {
                  SSServices.watchAds({ id })
                    .then((response) => {
                      if (response?.error === 'user already watched an ads today') {
                        toast.info(t('user already watched an ads today'));
                      } else {
                        dispatch(setSponsorPlayed(id));
                        SSServices.getMyPoints({ client: true }).then((result) => {
                          dispatch(setPoint(result?.data));
                          toast.success(t('Success get points from watch sponsor video.'));
                        });
                      }
                    })
                    .catch(() => {
                      toast.error(t('Failed get points from watch sponsor video.'));
                    });
                }
              }
            }}
          />
        )}

        {!isImage && (
          <>
            <span className="text-[12px] flex gap-1 py-1 px-1 absolute mt-[-30px] left-2 drop-shadow-3xl">
              Ads{' '}
              {currentPlaying === id ? (
                <Countdown
                  ref={_countdown}
                  date={Date.now() + totaDuration * 1000}
                  renderer={({ formatted }) => `${formatted.minutes}:${formatted.seconds}`}
                  onComplete={() => setCurrentPlaying(null)}
                  autoStart
                />
              ) : (
                `${moment.utc(totaDuration * 1000).format('mm:ss')}`
              )}
            </span>

            <span
              className="flex gap-1 p-1 absolute mt-[-30px] ml-[70px] cursor-pointer"
              onClick={() => setHasSound(!hasSound)}>
              {hasSound ? (
                <GiSpeaker fontSize="15px" color="#fff" className="drop-shadow-3xl" />
              ) : (
                <GiSpeakerOff fontSize="15px" color="#fff" className="drop-shadow-3xl" />
              )}
            </span>
          </>
        )}
      </div>

      {!isImage && (
        <div className="flex flex-col space-y-1 p-5 md:px-5 md:py-4">
          <span className="text-base font-semibold text-slate-50 two-line">{title}</span>
          {hasPlay || alreadyWatched ? (
            <span className="text-[10px] flex gap-1">
              <AiFillCheckCircle className="text-lime-500" />
              {t('Sponsor video has been played')}
            </span>
          ) : (
            <span className="text-[10px] md:text-xs w-full md:max-w-md">
              {t(
                'Watch this sponsor video until the end and collect 5 points. Watch it again tomorrow and get another 5 points!'
              )}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
