import PhotoProfile from 'components/element/PhotoProfile';
import Username from 'components/element/Username';
import { useEffect } from 'react';
import { useState } from 'react';
import service from 'core/services/publicService';
import { useRouter } from 'next/router';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

export default function LuckyDrawWinner({ eventId }) {
  const [data, setData] = useState([]);
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { locale } = useRouter();

  useEffect(() => {
    setIsLoading(true);
    service
      .get(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/lucky-draws/${eventId}/weekly-winners?language=${locale}`
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
      {data.length > 0 &&
        data
          .filter((item) => item?.is_show === 1)
          .map((item, index) => (
            <div
              className=" text-slate-50 rounded-[23px] bg-[#FFFE00] px-4 py-7 m-auto w-full h-full bg-cover bg-center"
              style={{
                backgroundImage:
                `url('${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/bg-layer.jpg')`,
                backgroundSize: 'cover'
              }}>
              <div className="flex flex-col space-y-7">
                <div className="flex flex-col items-center text-[#FF00FE]">
                  <h3 className="text-[44px] font-extrabold mb-5">{t('Lucky Draw')}</h3>
                  <span className="font-semibold text-sm text-center">
                    {moment(item?.event_contest?.start_date).format('DD MMMM YYYY')} -{' '}
                    {moment(item?.event_contest?.end_date).format('DD MMMM YYYY')}
                  </span>
                </div>
                <div className="relative flex flex-col gap-4 items-center">
                  <img
                    src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/crowns.png`}
                    alt="crowns"
                    className="w-12 m-auto"
                  />
                  {/* <img
            src="/assets/images/user.png"
            alt="user-avatar"
            className="w-[200px] h-[200px] rounded-full m-auto"
          /> */}
                  <PhotoProfile
                    image={item?.user?.photo ?? '/assets/images/user.png'}
                    styles="w-[200px] h-[200px] m-auto"
                  />
                  {/* <div className="absolute bottom-[-12px] left-1/2 -translate-x-1/2 rounded-full px-5 py-2 text-base text-[#FF00FE] bg-[#6CFF00]">
                {item?.points} Points
              </div> */}
                  {/* <div className="absolute bottom-6 right-14">
            <img src="/assets/icons/verified.png" alt="user-avatar" className="w-10" />
          </div> */}
                </div>
                <div className="flex flex-col gap-1 text-center text-[#0000FF] text-2xl">
                  {/* <h3 className="font-bold mb-3">Astria Pincawan</h3> */}
                  <Username
                    name={item?.user?.contestant?.artist_band_name ?? item?.user?.username}
                    fontStyle="font-bold mb-3"
                  />
                  <span className="font-semibold">{item?.luckydraw?.contestant_reward}</span>
                </div>
                <span className="text-[#0000FF] font-normal text-sm text-center">
                  {t('Winner announced on')} {moment(item?.drawn_at).format('DD MMMM YYYY')}
                </span>
              </div>
            </div>
          ))}
    </>
  );
}
