import PhotoProfile from 'components/element/PhotoProfile';
import Username from 'components/element/Username';
import { useEffect } from 'react';
import { useState } from 'react';
import ReactPlayer from 'react-player/youtube';
import service from 'core/services/publicService';
import { useRouter } from 'next/router';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

export default function OpeningActWinner({ eventId }) {
  const [data, setData] = useState([]);
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { locale } = useRouter();

  useEffect(() => {
    setIsLoading(true);
    service
      .get(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/lucky-draws/${eventId}/performer-winners?language=${locale}`
      )
      .then((res) => {
        setData(res?.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [locale]);

  return (
    <>
      {data.length > 0 && data.map((item, index) => (
        <div
          className=" text-slate-50 rounded-[23px] bg-[#6EFF01] px-4 py-7 m-auto w-full bg-cover bg-center"
          style={{ backgroundImage:`url('${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/bg-layer.jpg')`, backgroundSize: 'cover' }}
        >
          <div className="flex flex-col space-y-7">
            <div className="flex flex-col items-center text-[#FF00FE]">
              <h3 className="text-[44px] font-extrabold">{t('Opening Act')}</h3>
              <span className="font-semibold text-xl">{item?.user?.event_title} • {moment(item?.event_contest?.start_date).format('DD MMM YYYY')}</span>
            </div>
            <div className="relative">
              <PhotoProfile
                image={item?.user?.photo ?? '/assets/images/user.png'}
                styles="w-[200px] h-[200px] m-auto"
              />
              {/* <img
            src="/assets/images/user.png"
            alt="user-avatar"
            className="w-[200px] h-[200px] rounded-full m-auto"
          /> */}
              <div className="absolute bottom-[-12px] left-1/2 -translate-x-1/2 rounded-full px-5 py-2 text-base text-[#6CFF00] bg-[#FF00FE]">
                {new Intl.NumberFormat(locale, {
                  notation: item?.votes >= 10000 ? 'compact' : 'standard',
                  compactDisplay: 'short',
                  roundingMode: item?.votes >= 10000 ? 'floor' : 'halfExpand',
                  trailingZeroDisplay: 'stripIfInteger',
                  maximumFractionDigits: 1
                }).format(item?.votes)} Votes
              </div>
            </div>
            <div className="flex flex-col space-y-3 text-center text-[#0000FF] text-2xl">
              <Username name="Astria Pincawan" fontStyle="font-bold mb-3" />
              <h3 className="font-bold mb-3">{item?.user?.name}</h3>
              <span className="font-semibold">{item?.luckydraw?.performer_reward}</span>
              <span className="font-bold">Video: Hati Yang Kau Sakiti </span>
            </div>
            <div className="w-full h-[210px] bg-[#C6C6C6] rounded-[23px] overflow-hidden">
              <ReactPlayer
                url="https://youtu.be/ufanWw5vAuQ"
                width="100%"
                height="100%"
                controls
                className="w-full h-full"
                light
                playing
              />
            </div>
            <span className="text-[#0000FF] font-normal text-sm text-center">
              {t('Winner announced on')} {moment(item?.event_contest?.start_date).format('DD MMM YYYY')}
            </span>
          </div>
        </div>
      ))}
    </>
  );
}
