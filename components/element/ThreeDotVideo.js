import { useState, Fragment, useEffect } from 'react';
import { Popover, Transition } from '@headlessui/react';
import {
  eventApi,
  useAddFavoriteMutation,
  useGetFavoritesHistoryQuery
} from '../../core/services/rtk/EventServices';
import { useDispatch, useSelector } from 'react-redux';
import { setModal } from '../../core/redux/reducers/modalSlice';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import ModalShare from './modal/ModalShare';
import { setVideoId } from 'core/redux/reducers/threedotsSlice';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';

export default function ThreeDotVideo({
  idVideo,
  idArray,
  titleVideo,
  linkVideo,
  username,
  userID,
  stillLoading,
  performer,
  caption,
  handleFavorite,
  disableFavorite,
  isActiveFavorite
}) {
  const dispatch = useDispatch();
  const { basePath } = useRouter();
  const { t } = useTranslation();
  const { isAuthenticated, user } = useSelector((state) => state.authentication);
  const [open, setOpen] = useState(false);
  const [modalShareShow, setModalShareShow] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [addFavorite, { isSuccess: isSuccessAddFavorite, isLoading }] = useAddFavoriteMutation();
  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const { data: favoriteHistory } = useGetFavoritesHistoryQuery(
    { id: idVideo },
    {
      skip: stillLoading || !open || !isAuthenticated
    }
  );

  useEffect(() => {
    if (isSuccessAddFavorite) {
      dispatch(eventApi.util.invalidateTags([{ type: 'isFavorite', id: idVideo }]));
      dispatch(eventApi.util.invalidateTags([{ type: 'Favorite', id: idVideo }]));
      handleFavorite();
      toast.success(t('Success add to favorite'));
    }
  }, [isSuccessAddFavorite]);

  useEffect(() => {
    if (user && isAuthenticated) {
      setUrl(
        `${window.location.origin}${basePath}/video/${idVideo}?referral=${user?.my_referal_code}`
      );
    } else {
      setUrl(`${window.location.origin}${basePath}/video/${idVideo}`);
    }
  }, [user, idVideo]);

  const shareText = `${performer} - ${caption}
Check out my music video! Make sure to vote for it often so I can win the opportunity to perform at the wePOP come together on 6 August 2023.

It's Easy! Click this link, vote for me now, and you too can win amazing weekly prizes:
THANKS!
`;

  // const handleShare = () => {
  //   if (user && isAuthenticated) {

  //     shareWithNavigator({
  //       title: '',
  //       text: `${performer} - ${caption}
  //       Check out my music video! Make sure to vote for it often so I can win the opportunity to perform at the wePOP come together on 6 August 2023.

  //       It's Easy! Click this link, vote for me now, and you too can win amazing weekly prizes:

  //       THANKS!`,
  //       link: url,
  //     });

  //   } else {
  //     shareWithNavigator({
  //       title: event?.title,
  //       text: `How are you ${performer}`,
  //       link: url,
  //     });
  //   }
  // }
  useEffect(() => {
    if (modalShareShow) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  });

  //   } else {
  //     shareWithNavigator({
  //       title: event?.title,
  //       text: `How are you ${performer}`,
  //       link: url,
  //     });
  //   }
  // }

  return (
    <Popover className="relative">
      {modalShareShow && (
        <ModalShare
          videoId={idVideo}
          dataUser={user}
          text={shareText}
          url={url}
          quote={shareText}
          name={performer}
          captions={caption}
          onHide={() => setModalShareShow(false)}
          isUser={user?.id === userID}
        />
      )}
      <Popover.Button
        className="focus:outline-none"
        aria-label="more"
        onClick={() => setOpen(!open)}>
        <Image
        src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/more.png`}
        alt="chevron"
        width={28}
        height={28}
        />
      </Popover.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1">
        <Popover.Panel className="absolute -top-16 right-6 z-30 max-w-sm transform sm:px-0">
          <div className="relative z-100 p-4 mt-3 rounded-md bg-[#FF00CA] text-slate-50">
            <div className="flex flex-col gap-2 text-left w-full">
              {/* {!disableFavorite && (
                <button
                  className={`${
                    favoriteHistory?.data?.find((item) => item?.id === user?.id) ||
                    isActiveFavorite ||
                    isLoading
                      ? 'disabled:opacity-50 disabled:cursor-not-allowed'
                      : 'cursor-pointer'
                  }`}
                  onClick={() => {
                    if (!isAuthenticated) {
                      dispatch(
                        setModal({
                          name: 'modalLogin',
                          value: true
                        })
                      );
                      return;
                    }

                    if (!isActiveFavorite) {
                      addFavorite({ idVideo });
                    }
                  }}
                  disabled={isActiveFavorite || isLoading}>
                  <span className="text-white text-xs sm:text-sm flex items-center gap-2 cursor-pointer">
                    <img
                      src="/assets/icons/love-icon.svg"
                      alt="love-icon"
                      className="w-3"
                      loading="lazy"
                    />
                    <small>{isLoading ? 'Loading...' : `${t('Favorite')}`}</small>
                  </span>
                </button>
              )} */}
              {/* <div className="">
                <button type="button" className="text-sm" onClick={() => setModalShareShow(true)}>
                  <span className="text-xs sm:text-sm flex items-center gap-2 cursor-pointer ">
                    <img
                      src="/assets/icons/share-icon.svg"
                      alt="share-icon"
                      className="w-3"
                      loading="lazy"
                      width="100%"
                      height="100%"
                    />
                    <small>{t('Share')}</small>
                  </span>
                </button>
              </div> */}
              {user?.id !== userID && (
                <button
                  type="button"
                  className=" text-sm"
                  onClick={() => {
                    if (isAuthenticated) {
                      dispatch(setModal({ name: 'modalReportVideo', value: true }));
                      dispatch(setVideoId(idVideo));
                    } else {
                      dispatch(setModal({ name: 'modalLogin', value: true }));
                    }
                  }}>
                  <span
                    className="text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
                    aria-hidden="true">
                    <img
                      src="/assets/icons/report-icon.svg"
                      alt="report-icon"
                      className="w-3"
                      loading="lazy"
                    />
                    <small>{t('Report')}</small>
                  </span>
                </button>
              )}
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
