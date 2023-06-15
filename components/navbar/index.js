import { Disclosure } from '@headlessui/react';
import ChooseLanguage from 'components/element/ChooseLanguage';
import PhotoProfile from 'components/element/PhotoProfile';
import ShortByFilter from 'components/element/SortByFilter';
import Username from 'components/element/Username';
import { deleteCookie } from 'cookies-next';
import { clearSponsorPlayed } from 'core/redux/reducers/globalSlice';
import { setMemberships } from 'core/redux/reducers/membershipsSlice';
import { eventApi } from 'core/services/rtk/EventServices';
import { pointApi } from 'core/services/rtk/MeServices';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiOutlineMenu } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from 'core/redux/reducers/authenticationSlice';
import { setModal, setFilterContent, resetModal } from 'core/redux/reducers/modalSlice';
import { toast } from 'react-toastify';
import EmptyVoteModal from '../empty-placeholder/EmptyVoteModal';
import ChangeEmailModal from '../registration/ChangeEmailModal';
import ForgotPasswordModal from '../registration/ForgotPasswordModal';
import LoginModal from '../registration/LoginModal';
import OtpConfirmModal from '../registration/OtpConfirmationModal';
import RegisterModal from '../registration/RegisterModal';
import ResetPasswordModal from '../registration/ResetPasswordModal';
import ContinuePayModal from '../upload-video/ContinuePayModal';
import NotificationDropdown from './NotificationDropdown';
import ModalConfirmLogout from 'components/element/modal/ModalConfirmLogout';
import EllipsisText from 'react-ellipsis-text';

export default function Navbar(props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [photoProfile, setPhotoProfile] = useState('/assets/images/user.png');
  const [keyword, setKeyword] = useState('');
  const [isShowFilter, setIsShowFilter] = useState(router.pathname === '/');
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { memberships } = useSelector((state) => state.memberships);
  const { filterContent } = useSelector((state) => state.modal);
  const { isAuthenticated, user } = useSelector((state) => state.authentication);

  useEffect(() => {
    if (user) {
      const photoUrl = `${process.env.NEXT_PUBLIC_ASSET_URL}/${user?.photo}`;
      const checkIsPhotoUri = user?.photo?.includes(process.env.NEXT_PUBLIC_ASSET_URL);
      setPhotoProfile(checkIsPhotoUri ? user?.photo : photoUrl);
    }
  }, [user]);

  const { modalLogout } = useSelector((state) => state.modal);

  const dataMembershipStatus = props?.membershipStatus || {};

  // useEffect(() => {
  //   // dispatch(eventApi.util.invalidateTags(['ActiveMemberships']));
  // }, []);

  useEffect(() => {
    if (filterContent && filterContent === 'other') {
      setOpenSidebar(true);
    }
  }, [filterContent]);

  useEffect(() => {
    setIsShowFilter(router.pathname === '/');
  }, [router]);

  useEffect(() => {
    if (openSidebar) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  });

  const handleLogout = () => {
    deleteCookie('ftv_view');
    dispatch(clearSponsorPlayed());
    dispatch(logout()), setOpenSidebar(false), toast.success(t('Logout Success'));
    dispatch(setMemberships([]));
    deleteCookie('payment');
    dispatch(pointApi.util.resetApiState());
    dispatch(resetModal());
  };

  const handleModal = () => {
    setOpenModal(false);
    setOpenSidebar(false);
  };

  return (
    <div className="bg-[#282828] fixed top-0 right-0 left-0 z-40">
      <div className="flex justify-between items-center w-full px-4 py-5 text-slate-50 md:max-w-[78rem] md:m-auto lg:px-0">
        <div className="flex space-x-3 items-center flex-1">
          <div className="">
            {!process.env.NEXT_PUBLIC_IS_PRELAUNCH && (
              <AiOutlineMenu
                size={22}
                className="cursor-pointer"
                onClick={() => setOpenSidebar(!openSidebar)}
              />
            )}
          </div>
          <LoginModal />
          <ChangeEmailModal />
          <RegisterModal />
          <OtpConfirmModal />
          <ForgotPasswordModal />
          <ResetPasswordModal />
          <ContinuePayModal />
          {isOpen && <EmptyVoteModal onClose={() => setIsOpen(false)} />}
          {modalLogout && (
            <ModalConfirmLogout
              onHide={() => setOpenModal(false)}
              logout={() => (
                deleteCookie('ftv_view'),
                deleteCookie('_token'),
                deleteCookie('_userId'),
                deleteCookie('token'),
                dispatch(clearSponsorPlayed()),
                dispatch(logout()),
                toast.success(t('Logout Success')),
                dispatch(setMemberships([])),
                deleteCookie('payment'),
                dispatch(pointApi.util.resetApiState()),
                dispatch(resetModal())
              )}
            />
          )}
          {openSidebar && (
            <>
              <div className="absolute inset-0 bg-black/70 transition-all ease-in delay-300 duration-500 min-h-screen overflow-hidden">
                <div className="fixed top-0 left-0 transition-all ease-in delay-300 duration-500 w-full z-50 overflow-hidden">
                  <div className="bg-[#282828] text-slate-50 animate-l-to-r w-[92%] md:w-[40%] lg:w-[24%] min-h-screen p-4">
                    <div className="flex justify-end">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/close-icon.png`}
                        alt="close"
                        width={24}
                        height={24}
                        className="cursor-pointer"
                        onClick={() => {
                          setOpenSidebar(!openSidebar);
                          setKeyword('');
                          if (filterContent === 'other') {
                            dispatch(setFilterContent(null));
                          }
                        }}
                      />
                      {/* <RiCloseFill
                        size={32}
                        onClick={() => {
                          setOpenSidebar(!openSidebar);
                          setKeyword('');
                          if (filterContent === 'other') {
                            dispatch(setFilterContent(null));
                          }
                        }}
                        className="cursor-pointer"
                      /> */}
                    </div>
                    <div className="flex flex-col space-y-3">
                      {!isAuthenticated && (
                        <div className="flex flex-col space-y-3 mt-5">
                          <button
                            className="w-full p-3 bg-[#FF00FE] rounded-lg flex items-center justify-center"
                            onClick={() => (
                              dispatch(setModal({ name: 'modalLogin', value: true })),
                              setOpenSidebar(false)
                            )}>
                            {t('Login')}
                          </button>
                          <button
                            className="w-full p-3 border-2 border-[#FF00FE] rounded-lg flex items-center justify-center hover:bg-[#FF00FE]"
                            onClick={() => (
                              dispatch(setModal({ name: 'modalRegister', value: true })),
                              setOpenSidebar(false)
                            )}>
                            {t('Sign Up')}
                          </button>
                        </div>
                      )}
                      <div className="flex items-center space-x-2 bg-[#313131]  text-white p-4 rounded-md w-full font-normal pl-8 text-xs md:text-sm focus:outline-none mt-5">
                        <input
                          type="text"
                          name="search"
                          id="search"
                          className="search-explore bg-[#313131]  text-white w-full font-medium text-sm focus:outline-none"
                          placeholder="Search..."
                          autoFocus={filterContent === 'other'}
                          defaultValue={filterContent?.value ?? ''}
                          onChange={(e) => setKeyword(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              setOpenSidebar(false);
                              // dispatch(
                              //   setFilterContent({
                              //     type: 'search',
                              //     value: keyword
                              //   })
                              // );

                              if(keyword.length >=2)
                              {
                                router.push(`/search?keyword=${keyword}`);
                              } else {
                                router.push(`/search`);
                              }
                            }
                          }}
                        />
                        <div className="">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/search-icons.png`}
                            alt="search"
                            width={20}
                            height={20}
                            onClick={() => {
                              setOpenSidebar(false);
                              // dispatch(
                              //   setFilterContent({
                              //     type: 'search',
                              //     value: keyword
                              //   })
                              // );

                              if (keyword.length >= 2) {
                                router.push(`/search?keyword=${keyword}`);
                              } else {
                                router.push(`/search`);
                              }
                            }}
                          />
                          {/* <BsSearch
                            className="text-white cursor-pointer"
                            onClick={() => {
                              setOpenSidebar(false);
                              dispatch(
                                setFilterContent({
                                  type: 'search',
                                  value: keyword
                                })
                              );
                            }}
                          /> */}
                        </div>
                      </div>

                      <div className="flex flex-col space-y-4 h-[calc(100vh-180px)] md:h-full lg:h-[490px] overflow-y-auto pr-3">
                        {isAuthenticated && (
                          <div
                            className="flex items-center space-x-3 relative cursor-pointer"
                            onClick={() => (router.push('/my-account'), setOpenSidebar(false))}>
                            <PhotoProfile
                              image={user?.photo ?? '/assets/images/user.png'}
                              styles="w-16 h-16"
                              isActiveMemberships={
                                memberships?.length > 0 &&
                                dataMembershipStatus?.message ===
                                'Membership already paid and active'
                              }
                              className="flex-0"
                            />
                            <div className="flex-1 flex flex-col">
                              <Username
                                name={
                                  <EllipsisText
                                  text={
                                  user?.contestant?.artist_band_name ?? user?.firstname
                                  ?? 'Unknown'
                                  }
                                  length={20}
                                />
                                }
                                fontStyle="text-base font-semibold"
                              />
                            </div>
                          </div>
                        )}
                        {isAuthenticated && (
                          <div
                            aria-hidden
                            className=""
                            onClick={() => (router.push('/my-account'), setOpenSidebar(false))}>
                            <span
                              className={
                                router.pathname === '/my-account'
                                  ? 'text-base text-[#FF00CA] cursor-pointer'
                                  : 'text-base text-slate-50 cursor-pointer hover:text-[#FF00CA] transition-all delay-100 ease-in-out'
                              }>
                              {t('My Account')}
                            </span>
                          </div>
                        )}
                        {!process.env.NEXT_PUBLIC_IS_PRELAUNCH && (
                          <>
                            <div
                              aria-hidden
                              className="cursor-pointer"
                              onClick={() => (router.push('/event'), setOpenSidebar(false))}>
                              <span
                                className={
                                  router.pathname === '/event'
                                    ? 'text-base text-[#FF00CA] cursor-pointer'
                                    : 'text-base text-slate-50 cursor-pointer hover:text-[#FF00CA] transition-all delay-100 ease-in-out'
                                }>
                                Event
                              </span>
                            </div>
                            <div
                              aria-hidden
                              className=""
                              onClick={() => (router.push('/winners'), setOpenSidebar(false))}>
                              <span
                                className={
                                  router.pathname === '/winners'
                                    ? 'text-base text-[#FF00CA] cursor-pointer'
                                    : 'text-base text-slate-50 cursor-pointer hover:text-[#FF00CA] transition-all delay-100 ease-in-out'
                                }>
                                {t('Contest Winners')}
                              </span>
                            </div>
                            <Disclosure>
                              {({ open }) => (
                                <div>
                                  <Disclosure.Button
                                    className="flex w-full justify-between text-left text-sm font-medium focus:outline-none focus-visible:ring focus-visible:ring-opacity-75"
                                  // key={data.id}
                                  >
                                    <span className="text-base text-slate-50 cursor-pointer hover:text-[#FF00CA] transition-all delay-100 ease-in-out">
                                      FAQ
                                    </span>
                                    <Image
                                      src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/chevron-down.png`}
                                      alt="chevron"
                                      width={24}
                                      height={24}
                                      className={`${open ? 'rotate-180 transform' : ''}`}
                                    />
                                    {/* <IoIosArrowDown
                                      className={`${open ? 'rotate-180 transform' : ''} h-5 w-5`}
                                    /> */}
                                  </Disclosure.Button>
                                  <Disclosure.Panel className="text-xs sm:text-sm pt-4 ">
                                    <div className="border-l border-zinc-500 pl-3">
                                      <ul className="list-none font-reguler text-xs flex flex-col space-y-3 w-full">
                                        <li
                                          onClick={() => (
                                            router.push('/faq/#win-awesome'), setOpenSidebar(false)
                                          )}
                                          className="cursor-pointer">
                                          {t('What are the prizes?')}
                                        </li>
                                        <li
                                          onClick={() => (
                                            router.push('/faq/#how-to-win'), setOpenSidebar(false)
                                          )}
                                          className="cursor-pointer">
                                          {t('How to win?')}
                                        </li>
                                        <li
                                          onClick={() => (
                                            router.push('/faq/#collect-votes'),
                                            setOpenSidebar(false)
                                          )}
                                          className="cursor-pointer">
                                          {t('How to collect more points?')}
                                        </li>
                                        <li
                                          onClick={() => (
                                            router.push('/faq/#submit-video'), setOpenSidebar(false)
                                          )}
                                          className="cursor-pointer">
                                          {t('How to submit a video?')}
                                        </li>
                                        <li
                                          onClick={() => (
                                            router.push('/faq/#memberships'), setOpenSidebar(false)
                                          )}
                                          className="cursor-pointer">
                                          {t('How to upgrade my membership?')}
                                        </li>
                                        <li
                                          onClick={() => (
                                            router.push('/faq/#extra_points'), setOpenSidebar(false)
                                          )}
                                          className="cursor-pointer">
                                          {t('Buy More Points')}
                                        </li>
                                      </ul>
                                    </div>
                                  </Disclosure.Panel>
                                </div>
                              )}
                            </Disclosure>
                            <div
                              aria-hidden
                              className=""
                              onClick={() => (
                                router.push('/premium-access'), setOpenSidebar(false)
                              )}>
                              <span
                                className={
                                  router.pathname === '/premium-access'
                                    ? 'text-base text-[#FF00CA] cursor-pointer'
                                    : 'text-base text-slate-50 cursor-pointer hover:text-[#FF00CA] transition-all delay-100 ease-in-out'
                                }>
                                {t('Premium Backstage Access')}
                              </span>
                            </div>
                            <div
                              aria-hidden
                              className=""
                              onClick={() => (router.push('/sponsor'), setOpenSidebar(false))}>
                              <span
                                className={
                                  router.pathname === '/sponsor'
                                    ? 'text-base text-[#FF00CA] cursor-pointer'
                                    : 'text-base text-slate-50 cursor-pointer hover:text-[#FF00CA] transition-all delay-100 ease-in-out'
                                }>
                                {t('Sponsor Information')}
                              </span>
                            </div>
                          </>
                        )}
                        <ChooseLanguage />
                        <div
                          aria-hidden
                          className=""
                          onClick={() => (
                            router.push('/support/privacy-policy'), setOpenSidebar(false)
                          )}>
                          <span
                            className={
                              router.pathname === '/support/privacy-policy'
                                ? 'text-base text-[#FF00CA] cursor-pointer'
                                : 'text-base text-slate-50 cursor-pointer hover:text-[#FF00CA] transition-all delay-100 ease-in-out'
                            }>
                            {t('Support')}
                          </span>
                        </div>
                        {isAuthenticated && (
                          <div
                            aria-hidden
                            className="cursor-pointer"
                            onClick={() => (
                              dispatch(setModal({ name: 'modalLogout', value: true })),
                              setOpenSidebar(false),
                              deleteCookie('token'),
                              deleteCookie('ftv_view')
                            )}>
                            <span className="text-base cursor-pointer hover:text-[#FF00CA] transition-all delay-100 ease-in-out">
                              {t('Logout')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          <Link href="/">
            <img
              src="/assets/images/new-logo.png"
              alt="logo"
              className="w-36"
              width="100%"
              height="100%"
            // loading="lazy"
            />
          </Link>
        </div>
        <div className="flex items-center gap-1">
          <NotificationDropdown />
          {isShowFilter ? (
            <div className="flex-0">
              <ShortByFilter />
            </div>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
