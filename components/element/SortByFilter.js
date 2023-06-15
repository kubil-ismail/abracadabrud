import { Menu, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
// import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { useDispatch, useSelector } from 'react-redux';
import { setFilterContent } from 'core/redux/reducers/modalSlice';
import { toast } from 'react-toastify';
import LoadingBar from 'react-top-loading-bar';
import { useClickAway } from 'react-use';
import EllipsisText from 'react-ellipsis-text';
import Image from 'next/image';

export default function SortByFilter() {
  const dispatch = useDispatch();
  const [isShow, setIsShow] = useState(false);
  const [selected, setSelected] = useState(null);
  const [width, setWidth] = useState();
  const ref = useRef(null);
  const refs = useRef(null);

  const { t } = useTranslation();
  const {
    authentication: { token },
    modal: { filterContentLoading }
  } = useSelector((state) => state);

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

  useClickAway(refs, () => {
    if (isShow) setIsShow(false);
  });

  const isMobile = width <= 768;

  return (
    <div className="">
      <LoadingBar color="#E10BED" ref={ref} />

      <Menu as="div" className="relative inline-block text-left" ref={refs}>
        <div>
          <Menu.Button
            onClick={() => setIsShow(!isShow)}
            className="flex items-center gap-2 rounded-md bg-opacity-20 pl-2 text-sm md:text-base font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            <EllipsisText
              text={`${t('Sort by')} ${t(`${selected ? t(`${selected}`) : ''}`)}`}
              length={isMobile ? 13 : 20}
              className="text-[14px] m-0"
            />
            <Image
              src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/chevron-down.png`}
              alt="chevron"
              width={24}
              height={24}
            />
          </Menu.Button>
        </div>
        <Transition
          show={isShow}
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95">
          <Menu.Items
            className="absolute right-0 mt-2 w-44 origin-top-right divide-y divide-gray-100 rounded-md bg-[#282828] text-slate-50 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
            open>
            <div className="px-1 py-1 ">
              {[
                {
                  id: 'default',
                  name: 'All',
                  isLoading:
                    filterContentLoading?.type === 'default' && filterContentLoading?.loading,
                  onClick: () => {
                    dispatch(setFilterContent('default'));
                  }
                },
                {
                  id: 'latest_submission',
                  name: 'Latest video',
                  isLoading:
                    filterContentLoading?.type === 'latest_submission' &&
                    filterContentLoading?.loading,
                  onClick: () => {
                    dispatch(setFilterContent('latest_submission'));
                  }
                },
                {
                  id: 'date',
                  name: 'Date',
                  isLoading: filterContentLoading?.type === 'date' && filterContentLoading?.loading,
                  onClick: () => {
                    dispatch(setFilterContent('date'));
                  }
                },
                {
                  id: 'most_voted',
                  name: 'Most Votes',
                  isLoading:
                    filterContentLoading?.type === 'most_voted' && filterContentLoading?.loading,
                  onClick: () => {
                    dispatch(setFilterContent('most_voted'));
                  }
                },
                {
                  id: 'my_votes',
                  name: 'My Votes',
                  isLoading:
                    filterContentLoading?.type === 'my_votes' && filterContentLoading?.loading,
                  onClick: () => {
                    if (token) {
                      dispatch(setFilterContent('my_votes'));
                    } else {
                      toast.error(t('Login is required'));
                    }
                  }
                },
                {
                  id: 'my_videos',
                  name: 'My Videos',
                  isLoading:
                    filterContentLoading?.type === 'my_videos' && filterContentLoading?.loading,
                  onClick: () => {
                    if (token) {
                      dispatch(setFilterContent('my_videos'));
                    } else {
                      toast.error(t('Login is required'));
                    }
                  }
                },
                {
                  id: 'my_favorites',
                  name: 'My Favorites',
                  isLoading:
                    filterContentLoading?.type === 'my_favorites' && filterContentLoading?.loading,
                  onClick: () => {
                    if (token) {
                      dispatch(setFilterContent('my_favorites'));
                    } else {
                      toast.error(t('Login is required'));
                    }
                  }
                },
                {
                  id: 'events',
                  name: 'Events',
                  isLoading:
                    filterContentLoading?.type === 'events' && filterContentLoading?.loading,
                  onClick: () => {
                    dispatch(setFilterContent('events'));
                  }
                },
                {
                  id: 'other',
                  name: 'Other',
                  isLoading:
                    filterContentLoading?.type === 'search' && filterContentLoading?.loading,
                  onClick: () => {
                    dispatch(setFilterContent('other'));
                  }
                }
              ].map((item) => (
                <Menu.Item disabled={item?.isLoading}>
                  {({ active }) => (
                    <button
                      onClick={() => {
                        item.onClick();
                        setSelected(item?.name);
                        ref.current.continuousStart();
                        setTimeout(() => {
                          setIsShow(false);
                          ref.current.complete();
                        }, 1000);
                      }}
                      className={`${
                        active ? 'bg-[#333333] text-white' : 'text-slate-50'
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                      {item?.isLoading ? 'Loading...' : t(item?.name)}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
