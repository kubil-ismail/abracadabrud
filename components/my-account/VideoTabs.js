import moment from 'moment';
import ModalTransaction from '../element/modal/ModalTransactionDetail';
import EmptyTransaction from 'components/empty-placeholder/EmptyTransaction';
import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import service from 'core/services/publicService';
import { useTranslation } from 'react-i18next';

export default function VideoTabs() {
  const { t } = useTranslation();
  const selector = useSelector((state) => state.authentication);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [dataVideos, setDataVideos] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [lastPage, setLastPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const nextPageVideos = (next) => {
    setIsLoading(true);
    service
      .get(`${process.env.NEXT_PUBLIC_SITE_URL}/api/history-transactions/video?page_size=${pageSize}&page=${next}`)
      .then((res) => {
        setDataVideos([...dataVideos, ...(res?.data?.data ?? [])]);
        setLastPage(res?.data?.last_page);
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
    setDataVideos([]);
    setPage(1);
    if (selector?.user?.id) {
      setIsLoading(true);
      service
        .get(`${process.env.NEXT_PUBLIC_SITE_URL}/api/history-transactions/video?page_size=${pageSize}&page=${page}`)
        .then((res) => {
          setDataVideos(res?.data?.data ?? []);
          console.log('oy', res?.data?.data);
          setLastPage(res?.data?.last_page);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [selector?.user?.id]);

  return (
    <div className="flex flex-col gap-3 mx-3">
      {dataVideos?.length ? (
        <>
          <div className="grid grid-cols-3 gap-4">
            <h3 className="text-base font-bold">Invoice ID</h3>
            <h3 className="text-base font-bold text-right">Date</h3>
            <h3 className="text-base font-bold text-right">Total</h3>
          </div>
          {dataVideos?.map((data) => (
            <div
              className="grid grid-cols-3 gap-4 font-normal cursor-pointer"
              aria-hidden
              key={data?.id}
              onClick={() => setCurrentTransaction(data)}>
              <h3 className="text-base">{data?.order_id}</h3>
              <h3 className="text-base text-right">{moment(data?.created_at).calendar()}</h3>
              <h3 className="text-base text-right">{`Rp. ${data?.amount}`}</h3>
            </div>
          ))}
          {page < lastPage && (
            <div className="flex justify-center">
              {isLoading ? (
                // spinner
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                </div>
              ) : (
                <button
                  className="bg-zinc-800 text-white rounded-md px-4 py-2 mt-4"
                  onClick={() => {
                    const next = page + 1;
                    if (next <= lastPage) {
                      nextPageVideos(next);
                    }
                  }}>
                  {t('Load More')}
                </button>
              )}
            </div>
          )}
        </>
      ) : (
        <EmptyTransaction />
      )}

      <ModalTransaction
        isOpen={Boolean(currentTransaction)}
        closeModal={() => setCurrentTransaction(null)}
        data={currentTransaction}
      />
    </div>
  );
}
