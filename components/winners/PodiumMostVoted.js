import PhotoProfile from 'components/element/PhotoProfile';
import Username from 'components/element/Username';
import Link from 'next/link';
import { useEffect } from 'react';
import { useState } from 'react';
import ListRankVoted from './ListRankVoted';
import service from 'core/services/publicService';
import SkeletonPodium from 'components/skeleton/SkeletonPodium';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

export default function PodiumMostVoted({ title, eventId }) {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [lastPage, setLastPage] = useState(1);
  const [weeklyWinner, setWeeklyWinner] = useState([]);
  const { locale } = useRouter();

  const handleNextPage = (next) => {
    setIsLoading(true);
    service
      .get(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/contestants/events/${eventId}/most-voted?page=${next}`
      )
      .then((res) => {
        setData([...data, ...res?.contestants?.data]);
        setPage(next);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    service
      .get(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/contestants/events/${eventId}/most-voted?page=${page}`
      )
      .then((res) => {
        setData(res?.contestants?.data);
        setLastPage(res?.contestants?.last_page);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div
      className=" text-slate-50 rounded-[23px] overflow-hidden px-4 md:px-6 py-7 m-auto bg-cover bg-center"
      style={{
        backgroundImage: `url('${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/ftv.png')`,
        backgroundSize: 'cover'
      }}>
      <div className="flex flex-col space-y-4 overflow-hidden">
        <div className="flex flex-col space-y-2 items-center text-center leading-[250%]">
          <h3 className="font-extrabold text-[34px] text-[#23FF2C]" style={{ lineHeight: '100%' }}>
            {t(title)}
          </h3>
        </div>
        {data?.length > 0 ? (
          <>
            <div className="grid grid-cols-3 space-y-3 space-x-3 items-end">
              <div className="flex flex-col space-y-3 items-center">
                <div className="relative">
                  <Link href={`/user/${data[1]?.username ?? data[1]?.id}`}>
                    <PhotoProfile
                      image={data[1]?.photo ?? '/assets/images/user.png'}
                      styles="w-14 h-14 rounded-full border-4 border-slate-400"
                    />
                    {/* <img
                      src={data[1]?.photo ?? '/assets/images/user.png'}
                      alt="user-avatar"
                      className="w-14 h-14 rounded-full border-4 border-slate-400"
                      onError={(e) => e.target.src = "/assets/images/user.png"}
                    /> */}
                  </Link>
                  <div className="absolute top-1 -left-3 w-6 h-6 rounded-full flex items-center justify-center bg-slate-400 text-xs">
                    2
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <h3 className="text-xs font-semibold text-center">{`${new Intl.NumberFormat(
                    locale,
                    {
                      notation: data[1]?.votes >= 10000 ? 'compact' : 'standard',
                      compactDisplay: 'short',
                      roundingMode: data[1]?.votes >= 10000 ? 'floor' : 'halfExpand',
                      trailingZeroDisplay: 'stripIfInteger',
                      maximumFractionDigits: 1
                    }
                  ).format(data[1]?.votes)} Vote`}</h3>
                  <Link href={`/user/${data[1]?.username ?? data[1]?.id}`}>
                    <Username
                      name={data[1]?.contestant?.artist_band_name ?? data[1]?.name}
                      fontStyle={'text-xs font-semibold text-center block'}
                    />
                    {/* <h3 className="text-xs font-semibold text-center">{data[1]?.contestant?.artist_band_name ?? data[1]?.name}</h3> */}
                  </Link>
                </div>
                <div className="w-full rounded-t-2xl bg-[#0000FF] h-[74px] flex items-center justify-center font-extrabold text-[32px]">
                  2
                </div>
              </div>
              <div className="flex flex-col space-y-3 items-center">
                <img
                  src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/crowns.png`}
                  alt="crowns"
                  className="w-8 m-auto"
                />
                <div className="relative">
                  <Link href={`/user/${data[0]?.username ?? data[0]?.id}`}>
                    <PhotoProfile
                      image={data[0]?.photo ?? '/assets/images/user.png'}
                      styles="w-14 h-14 rounded-full border-4 border-slate-400"
                    />
                    {/* <img
                      src={data[0]?.photo ?? '/assets/images/user.png'}
                      alt="user-avatar"
                      className="w-14 h-14 rounded-full border-4 border-slate-400"
                      onError={(e) => e.target.src = "/assets/images/user.png"}
                    /> */}
                  </Link>
                  <div className="absolute top-1 -left-3 w-6 h-6 rounded-full flex items-center justify-center bg-[#AC8600] text-xs">
                    1
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <h3 className="text-xs font-semibold text-center">{`${new Intl.NumberFormat(
                    locale,
                    {
                      notation: data[0]?.votes >= 10000 ? 'compact' : 'standard',
                      compactDisplay: 'short',
                      roundingMode: data[0]?.votes >= 10000 ? 'floor' : 'halfExpand',
                      trailingZeroDisplay: 'stripIfInteger',
                      maximumFractionDigits: 1
                    }
                  ).format(data[0]?.votes)} Vote`}</h3>
                  <Link href={`/user/${data[0]?.username}`}>
                    <Username
                      name={data[0]?.contestant?.artist_band_name ?? data[0]?.name}
                      fontStyle={'text-xs font-semibold text-center block'}
                    />
                    {/* <h3 className="text-xs font-semibold text-center">{data[0]?.contestant?.artist_band_name ?? data[0]?.name}</h3> */}
                  </Link>
                </div>
                <div className="w-full rounded-t-2xl bg-[#0000FF] h-[97px] flex items-center justify-center font-extrabold text-[32px]">
                  1
                </div>
              </div>
              <div className="flex flex-col space-y-3 items-center">
                <div className="relative">
                  <Link href={`/user/${data[2]?.username ?? data[2]?.id}`}>
                    <PhotoProfile
                      image={data[2]?.photo ?? '/assets/images/user.png'}
                      styles="w-14 h-14 rounded-full border-4 border-slate-400"
                    />
                    {/* <img
                      src={data[2]?.photo ?? '/assets/images/user.png'}
                      alt="user-avatar"
                      className="w-14 h-14 rounded-full border-4 border-slate-400"
                      onError={(e) => e.target.src = "/assets/images/user.png"}
                    /> */}
                  </Link>
                  <div className="absolute top-1 -left-3 w-6 h-6 rounded-full flex items-center justify-center bg-[#763F17] text-xs">
                    3
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <h3 className="text-xs font-semibold text-center">{`${new Intl.NumberFormat(
                    locale,
                    {
                      notation: data[2]?.votes >= 10000 ? 'compact' : 'standard',
                      compactDisplay: 'short',
                      roundingMode: data[2]?.votes >= 10000 ? 'floor' : 'halfExpand',
                      trailingZeroDisplay: 'stripIfInteger',
                      maximumFractionDigits: 1
                    }
                  ).format(data[2]?.votes)} Vote`}</h3>
                  <Link href={`/user/${data[2]?.username}`}>
                    <Username
                      name={data[2]?.contestant?.artist_band_name ?? data[2]?.name}
                      fontStyle="text-xs font-semibold text-center block"
                    />
                    {/* <h3 className="text-xs font-semibold text-center">{data[2]?.contestant?.artist_band_name ?? data[2]?.name}</h3> */}
                  </Link>
                </div>
                <div className="w-full rounded-t-2xl bg-[#0000FF] h-[63px] flex items-center justify-center font-extrabold text-[32px]">
                  3
                </div>
              </div>
            </div>
            <ListRankVoted
              data={data}
              current={page}
              last={lastPage}
              loading={isLoading}
              handleNextPage={handleNextPage}
              eventId={eventId}
            />
          </>
        ) : (
          <SkeletonPodium loading={isLoading} />
        )}
      </div>
    </div>
  );
}
