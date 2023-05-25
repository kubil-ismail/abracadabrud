import Link from 'next/link';
import { useEffect, useState } from 'react';
import moment from 'moment';
import ReactPlayer from 'react-player/youtube';
import LoginModal from '../registration/LoginModal';
import RegisterModal from '../registration/RegisterModal';
import BottomSheetsFavorite from '../bottom-sheets/BottomSheetsFavorite';
import BottomSheetsComment from '../bottom-sheets/BottomSheetsComment';
import BottomSheetsVote from '../bottom-sheets/BottomSheetsVote';
import ForgotPasswordModal from '../registration/ForgotPasswordModal';
import ResetPasswordModal from '../registration/ResetPasswordModal';
import OtpConfirmModal from '../registration/OtpConfirmationModal';
import { useDispatch, useSelector } from 'react-redux';
import EmptyVoteModal from '../empty-placeholder/EmptyVoteModal';
import ThreeDotVideo from './ThreeDotVideo';
import { useGetVideoQuery } from '../../core/services/rtk/EventServices';
import SkeletonVideo from '../skeleton/SkeletonVideo';
import ButtonVote from './ButtonVote';

export default function MyVideoCard({ data }) {
  const [isOpen, setIsOpen] = useState(false);
  const [photoProfile, setPhotoProfile] = useState('/assets/images/user.png');
  useEffect(() => {
    if (data) {
      const photoUrl = `${process.env.NEXT_PUBLIC_ASSET_URL}/${data?.user?.photo}`;
      const checkIsPhotoUri = data?.user?.photo?.includes(process.env.NEXT_PUBLIC_ASSET_URL);
      setPhotoProfile(checkIsPhotoUri ? data?.user?.photo : photoUrl);
    }
  }, [data]);

  const { modalLogin, modalRegister, modalOtp, modalForgotPassword, modalResetPassword } =
    useSelector((state) => state.modal);
  const { isAuthenticated, token } = useSelector((state) => state.authentication);

  const dispatch = useDispatch();
  const {
    data: dataVideo,
    isLoading,
    error,
    isSuccess
  } = useGetVideoQuery(
    {},
    {
      refetchOnMountOrArgChange: true
    }
  );

  if (isLoading) {
    return <SkeletonVideo />;
  }

  if (isSuccess) {
    return (
      <div className="max-w-5xl m-auto">
        <div className="grid grid-cols-1 gap-4 text-slate-50">
          {!isAuthenticated && modalLogin && <LoginModal />}
          {!isAuthenticated && modalRegister && <RegisterModal />}
          {!isAuthenticated && modalOtp && <OtpConfirmModal />}
          {!isAuthenticated && modalForgotPassword && <ForgotPasswordModal />}
          {!isAuthenticated && modalResetPassword && <ResetPasswordModal />}
          {isOpen && <EmptyVoteModal onClose={() => setIsOpen(false)} />}
          {/* {
                        dataVideo?.data.map((data, index) => (
                            data?.partner_id ? (
                                <SponsorVideo video={data?.video_url} />
                            ) :
                                ( */}
          <div className="flex flex-col gap-3 mb-[20px]" key={data?.id}>
            <div className="w-full h-[191px] md:h-[440px] rounded-[23px] overflow-hidden">
              <div className="w-full h-full">
                <ReactPlayer
                  url={data?.video || data?.video_url}
                  width="100%"
                  height="100%"
                  light={true}
                  controls
                  playing
                  className="w-full h-full"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-1">
              <div className="flex justify-between w-full text-slate-50">
                <div className="flex gap-[10px]">
                  <div className="flex-0">
                    {
                      data?.user?.photo ? (
                        <Link href="/user">
                        <div className="w-[52px] h-[52px] rounded-full">
                          <img
                            src={photoProfile}
                            alt="avatar"
                            className="w-full h-full object-cover rounded-full"
                            onError={() => setPhotoProfile('/assets/images/user.png')}
                          />
                        </div>
                      </Link>
                      ) : (
                        <div className="w-[52px] h-[52px] rounded-full">
                        <img
                          src="/asset/images/user.png"
                          alt="avatar"
                          className="w-full h-full object-cover rounded-full"
                        />
                      </div>
                      )
                    }
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex gap-1 items-center text-xs font-normal">
                      <span className="">{data?.user?.name}</span>
                      <span>&middot;</span>
                      <span className="">{moment(data?.created_at, 'YYYYMMDD').fromNow()}</span>
                    </div>
                    <h3 className="text-[18px] font-extrabold m-0">{data?.caption}</h3>
                  </div>
                </div>
                <div className="flex-0">
                  <ThreeDotVideo
                    idVideo={data?.thumbnails[0]?.video_id}
                    idArray={data?.id}
                    titleVideo={data?.caption}
                    username={data?.user?.name}
                    userID={data?.user_id}
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <div className="w-[64px] invisible" />
                <div className="flex gap-3 w-full">
                  <div className="flex-1 flex items-center gap-8 md:gap-12 w-full">
                    <BottomSheetsFavorite
                      idVideo={data?.thumbnails[0]?.video_id}
                      idArray={data?.id}
                    />
                    <BottomSheetsComment
                      total={data?.comments_count}
                      idVideo={data?.thumbnails[0]?.video_id}
                      idArray={data?.id}
                    />
                    <BottomSheetsVote
                      total={data?.votes}
                      idVideo={data?.thumbnails[0]?.video_id}
                      idArray={data?.id}
                    />
                  </div>
                  <div className="flex-0">
                    {/* <button type="button" onClick={() =>
                                        !isAuthenticated ? dispatch(setModal({ name: 'modalLogin', value: true })) : setIsOpen(true)
                                    } className="flex items-center gap-2 py-2 px-3 bg-[#FF00CA] text-[#0000FF] rounded-md">
                                        <img src="/assets/icons/btn-vote-icon.svg" alt="btn-vote-icon" className="w-5" />
                                        <span className="text-sm font-extrabold">Vote</span>
                                    </button> */}
                    <ButtonVote idVideo={data?.thumbnails[0]?.video_id} idArray={data?.id} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* // )
                        // )) */}
          {/* } */}
        </div>
      </div>
    );
  }
}
