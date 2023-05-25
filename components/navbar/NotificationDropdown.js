/* eslint-disable max-len */
import { Popover, Tab, Transition } from '@headlessui/react';
import MembershipActive from 'components/element/notification/MembershipActive';
import SuccessPayments from 'components/element/notification/SuccessPayments';
import VoteNotif from 'components/element/notification/VoteNotif';
import WaitingPayments from 'components/element/notification/WaitingPayments';
import WinnerNotification from 'components/element/notification/WinnerNotif';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import service from 'core/services/publicService';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import EmptyNotification from 'components/empty-placeholder/EmptyNotification';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function NotificationDropdown() {
  const { locale } = useRouter();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const [datas] = useState([
    { id: 1, title: 'Announcements' },
    { id: 2, title: 'Transaction' }
  ]);
  const { token, isAuthenticated } = useSelector((state) => state.authentication);
  const [transactions, setTransactions] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [pageTransaction, setPageTransaction] = useState(1);
  const [pageAnnouncement, setPageAnnouncement] = useState(1);
  const [lastPageTransaction, setLastPageTransaction] = useState(1);
  const [lastPageAnnouncement, setLastPageAnnouncement] = useState(1);
  const [isLoadingTransaction, setIsLoadingTransaction] = useState(false);
  const [isLoadingAnnouncement, setIsLoadingAnnouncement] = useState(false);
  const [unHasRead, setUnHasRead] = useState(0);
  const pageSize = 10;

  const markAllAsRead = () => {
    service
      .post(
        `/notifications/mark-all-as-read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      .then(() => {
        setUnHasRead(0);
      });
  };

  const handleNextTransaction = (next) => {
    setIsLoadingTransaction(true);
    service
      .get(`/notifications?page=${next}&page_size=${pageSize}&types=payment`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(({ data }) => {
        setTransactions([...transactions, ...(data?.data?.data ?? [])]);
        setLastPageTransaction(data?.data?.last_page);
        setPageTransaction(next);
        console.log(data?.un_has_read)
        setUnHasRead(data?.un_has_read);
      })
      .finally(() => {
        setIsLoadingTransaction(false);
      });
  };

  const handleNextAnnouncement = (next) => {
    setIsLoadingAnnouncement(true);
    service
      .get(`/notifications?page=${next}&page_size=${pageSize}&types=vote`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(({ data }) => {
        setAnnouncements([...announcements, ...(data?.data?.data ?? [])]);
        setLastPageAnnouncement(data?.data?.last_page);
        setPageAnnouncement(next);
        setUnHasRead(data?.un_has_read);
      })
      .finally(() => {
        setIsLoadingAnnouncement(false);
      });
  };

  const { pathname, query } = router;

  useEffect(() => {
    setTransactions([]);
    setAnnouncements([]);
    setPageTransaction(1);
    setPageAnnouncement(1);
    setLastPageTransaction(1);
    setLastPageAnnouncement(1);
    setIsLoadingTransaction(false);
    setIsLoadingAnnouncement(false);
    setUnHasRead(0);

    if (token) {
      setIsLoadingTransaction(true);
      setIsLoadingAnnouncement(true);
      service
        .get(`/notifications?page=1&page_size=${pageSize}&types=payment`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(({ data }) => {
          setTransactions(data?.data?.data ?? []);
          setLastPageTransaction(data?.data?.last_page);
          setUnHasRead(data?.un_has_read);
        })
        .finally(() => {
          setIsLoadingTransaction(false);
        });

      service
        .get(`/notifications?page=1&page_size=${pageSize}&types=vote`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(({ data }) => {
          setAnnouncements(data?.data?.data ?? []);
          setLastPageAnnouncement(data?.data?.last_page);
          setUnHasRead(data?.un_has_read);
        })
        .finally(() => {
          setIsLoadingAnnouncement(false);
        });
    }
  }, [isAuthenticated]);

  return (
    <Popover className="relative">
      <Popover.Button className="focus:outline-none">
        <button
          className=" text-white mt-1"
          onClick={() => {
            setOpen(!open);
          }}>
          {unHasRead > 0 &&
            <span className="absolute top-0 -right-2 h-4 w-4 rounded-full bg-[#FF00FE] text-cyan-900 flex justify-center items-center items text-[10px]">
              {(unHasRead > 9 ? '9+' : unHasRead)}
            </span>
          }
          <Image
            src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/notifications.png`}
            alt="bell"
            width={20}
            height={20}
          />
        </button>
      </Popover.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1">
        <Popover.Panel className="fixed right-4 md:right-8 mt-3 w-[80%] md:max-w-sm transform px-3 sm:px-0 shadow-lg bg-[#323234] rounded-md min-h-[420px] focus:outline-none">
          <div className="relative z-100 bg-[#323234] text-slate-50 pt-2 px-2 md:px-3 pb-1 mt-2 rounded-md h-[380px] overflow-hidden">
            <div>
              <div className="container flex justify-between mt-4 mb-5 px-3">
                <h3 className="text-lg font-semibold">{t('Notification')}</h3>
                <span className="text-sm font-medium text-[#FF00FE]">
                  {unHasRead > 0 && (
                    <button
                      type="button"
                      className="focus:outline-none hover:underline text-[#FF00FE] text-sm font-semibold"
                      onClick={() => {
                        markAllAsRead();
                      }}>
                      {t('Mark all as read')}
                    </button>
                  )}
                </span>
              </div>
              <div className="">
                <Tab.Group>
                  <Tab.List className="flex items-center gap-3 my-2 border-b border-zinc-700">
                    {datas.map((data) => (
                      <Tab
                        key={data.id}
                        className={({ selected }) =>
                          classNames(
                            selected
                              ? 'flex justify-center items-center items text-[#FF00FE] border-b-2 border-[#FF00FE] text-sm md:text-base font-semibold pb-2 focus:outline-none w-full'
                              : 'flex justify-center items-center items focus:outline-none text-slate-50 text-sm md:text-base w-full pb-2 font-normal'
                          )
                        }>
                        {t(data.title)}
                      </Tab>
                    ))}
                  </Tab.List>
                  <Tab.Panels
                    className="pt-2 focus:outline-none"
                    style={{ height: '464px', overflow: 'auto' }}>
                    {datas.map((data) => (
                      <div key={data.id}>
                        <Tab.Panel id={data.id}>
                          {data.id === 1 && (
                            <div className="container py-2 overflow-y-auto h-[270px]">
                              {announcements?.length === 0 && isLoadingAnnouncement && (
                                <div className="flex justify-center items-center items">
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#FF00FE]"></div>
                                </div>
                              )}
                              {announcements?.length > 0 ? (
                                announcements?.map((item) =>
                                  item?.type === 'winner' ? (
                                    <WinnerNotification data={item} />
                                  ) : (
                                    <VoteNotif data={item} />
                                  )
                                )
                              ) : (<EmptyNotification />)}
                              {/* more */}
                              <div className="flex justify-center items-center items pt-2">
                                {pageAnnouncement < lastPageAnnouncement && (
                                  <button
                                    type="button"
                                    className="text-[#FF00FE] text-sm font-semibold focus:outline-none"
                                    onClick={() => {
                                      const next = pageAnnouncement + 1;
                                      if (next <= lastPageAnnouncement) {
                                        handleNextAnnouncement(next);
                                      } else {
                                        setIsLoadingAnnouncement(false);
                                      }
                                    }}
                                    disabled={isLoadingAnnouncement}>
                                    {isLoadingAnnouncement ? 'Loading...' : 'More'}
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                          {data.id === 2 && (
                            <div className="flex flex-col overflow-y-auto h-[270px]">
                              {transactions?.length === 0 && isLoadingTransaction && (
                                <div className="flex justify-center items-center items">
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#FF00FE]"></div>
                                </div>
                              )}
                              {transactions?.length > 0 ? (
                                transactions
                                  .map((item) =>
                                    item?.title?.includes('Waiting') ? (
                                      <WaitingPayments data={item} />
                                    ) : item?.title?.includes('paid') || item?.title?.includes('Successful') ? (
                                      <SuccessPayments data={item} />
                                    ) : item?.title?.includes('active') ? (
                                      <MembershipActive data={item} />
                                    ) : (
                                      ''
                                    )
                                  )
                              ) : (
                                <EmptyNotification />
                              )}
                              {/* more */}
                              <div className="flex justify-center items-center items pt-2">
                                {pageTransaction < lastPageTransaction && (
                                  <button
                                    type="button"
                                    className="text-[#FF00FE] text-sm font-semibold focus:outline-none"
                                    onClick={() => {
                                      const next = pageTransaction + 1;
                                      if (next <= lastPageTransaction) {
                                        handleNextTransaction(next);
                                      } else {
                                        setIsLoadingTransaction(false);
                                      }
                                    }}
                                    disabled={isLoadingTransaction}>
                                    {isLoadingTransaction ? 'Loading...' : 'More'}
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </Tab.Panel>
                      </div>
                    ))}
                  </Tab.Panels>
                </Tab.Group>
              </div>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
