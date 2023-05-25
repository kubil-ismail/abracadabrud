import PhotoProfile from 'components/element/PhotoProfile';
import Username from 'components/element/Username';
import { useEffect, useState } from 'react';
import service from 'core/services/publicService';
import { useRouter } from 'next/router';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

export default function MostPointWinner({ eventId }) {
  const [data, setData] = useState([]);
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { locale } = useRouter();

  useEffect(() => {
    setIsLoading(true);
    service
      .get(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/lucky-draws/${eventId}/weekly-most-point-winners?language=${locale}`
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
          className=" text-slate-50 rounded-[23px] bg-[#FF00FE] px-4 py-7 m-auto w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url('${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/bg-layer.jpg')`, backgroundSize: 'cover' }}
        >
          <div className="flex flex-col space-y-7">
            <div className="flex flex-col items-center text-[#0000FF]">
              <h3 className="text-[44px] font-extrabold text-center">{t('Most Points')}</h3>
              <span className="font-semibold text-sm text-center">
                {moment(item?.event_contest?.start_date).format('DD MMMM YYYY')} -{' '} {moment(item?.event_contest?.end_date).format('DD MMMM YYYY')}
              </span>
            </div>
            <div className="relative flex flex-col space-y-4 items-center">
              <img src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/crowns.png`} alt="crowns" className="w-12 m-auto" />
              <PhotoProfile
                image={item?.user?.photo ?? '/assets/images/user.png'}
                styles="w-[200px] h-[200px] m-auto"
              />
              {/* <img
            src="/assets/images/user.png"
            alt="user-avatar"
            className="w-[200px] h-[200px] rounded-full m-auto"
          /> */}
              <div className="absolute bottom-[-12px] left-1/2 -translate-x-1/2 rounded-full px-5 py-2 text-base text-[#FF00FE] bg-[#6CFF00]">
                {new Intl.NumberFormat(locale, {
                  notation: item?.point >= 10000 ? 'compact' : 'standard',
                  compactDisplay: 'short',
                  roundingMode: item?.point >= 10000 ? 'floor' : 'halfExpand',
                  trailingZeroDisplay: 'stripIfInteger',
                  maximumFractionDigits: 1
                }).format(item?.point)} Points
              </div>
              {/* <div className="absolute bottom-6 right-14">
            <img src="/assets/icons/verified.png" alt="user-avatar" className="w-10" />
          </div> */}
            </div>
            <div className="flex flex-col space-y-2 text-center text-[#0000FF] text-2xl">
              <Username name={item?.user?.contestant?.artist_band_name ?? item?.user?.username} fontStyle="font-bold" />
              <span className="font-semibold">{item?.luckydraw?.contestant_reward}</span>
            </div>
            <span className="text-slate-50 font-normal text-sm text-center">
              {t('Winner announced on')} {moment(item?.drawn_at).format('DD MMMM YYYY')}
            </span>
          </div>
        </div>
      ))}
    </>
  );
}
