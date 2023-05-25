import { useState, Fragment, useEffect } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import { setModal } from 'core/redux/reducers/modalSlice';
import { useAddVotesMutation, useGetAllEventsQuery } from 'core/services/rtk/EventServices';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import SSServices from 'core/services/ServerSide/ssServices';
import { setPoint } from 'core/redux/reducers/pointSlice';

export default function ButtonVote({ idVideo, handleVote, small }) {
  const [vote, setVote] = useState(1);
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [width, setWidth] = useState();
  const [options, setOptions] = useState([
    { value: 1, label: '1' },
    { value: 5, label: '5' },
    { value: 25, label: '25' },
    { value: 100, label: '100' },
    { value: 500, label: '500' }
  ]);
  const dispatch = useDispatch();

  const { isAuthenticated, token } = useSelector((state) => state.authentication);
  const { myPoint: data } = useSelector((state) => state.points);
  const { allEvents: events } = useSelector((state) => state.global);
  const [addVotes, { isLoading, isError, error: errorAddVotes, isSuccess }] = useAddVotesMutation();

  useEffect(() => {
    if (isSuccess) {
      handleVote(vote);
      SSServices.getMyPoints({ token, client: true }).then((result) => {
        dispatch(setPoint(result?.data));
      });
      setOpen(!open);
      setVote(1);
      toast.success(t('Success vote video'));
    }
  }, [isSuccess]);

  useEffect(() => {
    if (!open) {
      setVote(1);
    }
  }, [open]);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    setWidth(window.innerWidth);
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  return (
    <>
      {/* {data?.data?.remaining < 5 && open &&
        <EmptyVoteModal onClose={!open} />
      } */}
      {events?.data?.data?.length > 0 && data?.remaining > 0 ? (
        <Popover className="relative">
          {({ open }) => (
            <>
              {open ? (
                <Popover.Button
                  className={`focus:outline-none flex items-center gap-2 ${small ? 'py-1.5 px-2' : 'py-2 px-3'
                    } bg-[#FF00CA] text-[#0000FF] rounded-md`}
                  onClick={() => {
                    if (data?.remaining < 1) {
                      setOpen(!open);
                      return dispatch(setModal({ name: 'modalEmptyVote', value: true }));
                    } else {
                      addVotes({
                        id: idVideo,
                        vote
                      });
                    }
                  }}>
                  <span className="text-sm font-extrabold">{t('Submit')}</span>
                </Popover.Button>
              ) : (
                <Popover.Button
                  className={`flex items-center gap-2 ${small ? 'py-1.5 px-2' : 'py-2 px-3'
                    }  bg-[#FF00CA] text-[#0000FF] rounded-md focus:outline-none ${process.env.NEXT_PUBLIC_IS_PRELAUNCH && 'btn-disabled-pink'
                    }`}
                  disabled={process.env.NEXT_PUBLIC_IS_PRELAUNCH}
                  onClick={() => {
                    if (!process.env.NEXT_PUBLIC_IS_PRELAUNCH) {
                      if (!isAuthenticated) {
                        return dispatch(setModal({ name: 'modalLogin', value: true }));
                      }
                      setOpen(!open);
                    }
                  }}>
                  <img
                    src="/assets/icons/btn-vote-icon.svg"
                    alt="btn-vote-icon"
                    className={small ? 'w-4' : 'w-5'}
                    loading="lazy"
                    width="100%"
                    height="100%"
                  />
                  <span className="text-sm font-extrabold">
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#0000FF]"></div>
                    ) : (
                      'Vote'
                    )}
                  </span>
                </Popover.Button>
              )}
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1">
                <Popover.Panel className={`absolute -top-[185px] z-30 max-w-sm transform sm:px-0`}>
                  <div className="relative z-100 p-3 mt-3 rounded-md bg-[#FF00CA] text-slate-50">
                    <div className="flex flex-col gap-2 text-center w-full">
                      <h3 className="text-xs font-medium">{t('Select # of votes to cast')}</h3>
                      <div className="flex flex-col gap-2">
                        {data?.remaining
                          ? options.map((item, index) => {
                            return (
                              <div className="flex items-center gap-1" key={index}>
                                <input
                                  type="radio"
                                  id={item.value}
                                  name="vote"
                                  value={item.value}
                                  onClick={() => setVote(item.value)}
                                  disabled={data?.remaining < item.value}
                                  defaultChecked={index === 0}
                                />
                                <span className="text-[10px]">{item.label}</span>
                              </div>
                            );
                          })
                          : options.map((item, index) => {
                            return (
                              <div className="flex items-center gap-1" key={index}>
                                <input
                                  type="radio"
                                  id={item.value}
                                  name="vote"
                                  value={item.value}
                                  onClick={() => setVote(item.value)}
                                  disabled={true}
                                  defaultChecked={index === 0}
                                />
                                <span className="text-[10px]">{item.label}</span>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
      ) : (
        <button
          className={`flex items-center gap-2 ${small ? 'py-1 px-2' : 'py-2 px-3'
            }  bg-[#FF00CA] text-[#0000FF] rounded-md focus:outline-none ${process.env.NEXT_PUBLIC_IS_PRELAUNCH && 'btn-disabled-pink'
            }`}
          onClick={() => {
            if (!process.env.NEXT_PUBLIC_IS_PRELAUNCH) {
              if (events?.data?.data?.length < 1) {
                toast.error(t("Can't vote, event already ended"));
                return;
              } else if (data?.remaining < 1) {
                dispatch(setModal({ name: 'modalEmptyVote', value: true }));
                return
              }
            }
          }}
          disabled={process.env.NEXT_PUBLIC_IS_PRELAUNCH}>
          <img
            src="/assets/icons/btn-vote-icon.svg"
            alt="btn-vote-icon"
            className={small ? 'w-4' : 'w-5'}
            loading="lazy"
            width="100%"
            height="100%"
          />
          <span className="text-sm font-bold">Vote</span>
        </button>
      )}
    </>
  );
}
