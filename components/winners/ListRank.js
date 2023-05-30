import Username from 'components/element/Username';
import Link from 'next/link';
import { useEffect } from 'react';
import { useState } from 'react';
import service from 'core/services/publicService';
import LoadingPodium from 'components/skeleton/LoadingPodium';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

export default function ListRank({ data, current, last, loading, handleNextPage, eventId }) {
  const { t } = useTranslation();
  const [currentUser, setCurrentUser] = useState(null);
  const router = useRouter();
  const { locale } = useRouter();

  useEffect(() => {
    service
      .get(`${process.env.NEXT_PUBLIC_SITE_URL}/api/points/event/${eventId}/my-point-ranking`)
      .then((res) => {
        setCurrentUser(res?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [eventId]);

  return (
    <div className="flex flex-col space-y-3">
      {currentUser && (
        <div className="flex justify-between space-x-3 w-full bg-white/60 text-slate-50 p-1 rounded-md">
          <div className="flex-0">
            <h3 className="text-xl font-bold">{currentUser?.current_user_position}</h3>
          </div>
          <Link
            href={`/user/${currentUser?.details?.user?.username ?? currentUser?.id}`}
            className="flex-1 flex flex-col">
            <Username
              name={
                currentUser?.details?.user?.contestant?.artist_band_name ??
                currentUser?.details?.user?.username
              }
              fontStyle="text-base md:text-lg font-bold"
            />
            {/* <h3 className="text-base md:text-lg font-bold">{item?.user?.contestant?.artist_band_name ?? item?.user?.username}</h3> */}
          </Link>
          <div className="flex-0">
            <h3 className="text-xl font-bold">
              {new Intl.NumberFormat(locale, {
                notation: currentUser?.details?.total_points >= 10000 ? 'compact' : 'standard',
                compactDisplay: 'short',
                roundingMode: currentUser?.details?.total_points >= 10000 ? 'floor' : 'halfExpand',
                trailingZeroDisplay: 'stripIfInteger',
                maximumFractionDigits: 1
              }).format(currentUser?.details?.total_points)}
            </h3>
          </div>
        </div>
      )}
      {/* scrollable */}
      <div
        className="flex flex-col space-y-3 overflow-y-auto pr-1"
        style={{ maxHeight: 'calc(80vh - 280px)' }}>
        {data?.slice(3, data.length).map((item, i) => (
          <div className="flex justify-between space-x-3 w-full" key={i}>
            <div className="flex-0">
              <h3 className="text-xl font-bold">{4 + i}</h3>
            </div>
            <Link
              href={`/user/${item?.user?.username ?? item?.id}`}
              className="flex-1 flex flex-col">
              <Username
                name={item?.user?.contestant?.artist_band_name ?? item?.user?.username}
                fontStyle="text-base md:text-lg font-bold"
              />
              {/* <h3 className="text-base md:text-lg font-bold">{item?.user?.contestant?.artist_band_name ?? item?.user?.username}</h3> */}
            </Link>
            <div className="flex-0">
              <h3 className="text-xl font-bold">
                {new Intl.NumberFormat(locale, {
                  notation: item?.total_points >= 10000 ? 'compact' : 'standard',
                  compactDisplay: 'short',
                  roundingMode: item?.total_points >= 10000 ? 'floor' : 'halfExpand',
                  trailingZeroDisplay: 'stripIfInteger',
                  maximumFractionDigits: 1
                }).format(item?.total_points)}
              </h3>
            </div>
          </div>
        ))}
      </div>
      {loading && <LoadingPodium />}
      <div className="flex flex-col space-y-3">
      {current < last && (
        <button
          className="my-1 text-slate-50 text-sm m-auto p-3 border border-slate-50 rounded-md focus:outline-none"
          onClick={() => {
            if (current < last) {
              handleNextPage(current + 1);
            }
          }}>
          {loading ? 'Loading...' : `${t('Show More')}`}
        </button>
      )}
      <button
        className="bg-[#0000FF] text-slate-50 text-sm md:text-lg m-auto px-4 py-3 md:py-2 rounded-lg w-full focus:outline-none"
        onClick={() => {
          router.push('/faq#collect-votes');
        }}>
        {t('Collect more points!')}
      </button>
      </div>
    </div>
  );
}
