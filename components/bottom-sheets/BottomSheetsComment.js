import React, { useEffect, useState, useRef } from 'react';
import moment from 'moment';
import EmptyComment from '../empty-placeholder/EmptyComment';
import service from 'core/services/publicService';
import { useAddCommentsMutation } from '../../core/services/rtk/EventServices';
import { useDispatch, useSelector } from 'react-redux';
import { BottomSheet } from 'react-spring-bottom-sheet';
import { setModal } from '../../core/redux/reducers/modalSlice';
import PhotoProfile from 'components/element/PhotoProfile';
import Username from 'components/element/Username';

export default function BottomSheetsComment({
  total = 0,
  idVideo,
  idArray,
  stillLoading,
  handleComment
}) {
  const divRef = useRef(null);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState();
  const [totalComment, setTotalComment] = useState(total);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [datas, setDatas] = useState([]);
  const [totalData, setTotalData] = useState(1);
  const [isError, setIsError] = useState(true);
  const [isFetching, setIsFetching] = useState(true);
  const { isAuthenticated, user } = useSelector((state) => state.authentication);

  const [addComment, { isSuccess: isSuccessAddComment, isLoading: loadingComment }] =
    useAddCommentsMutation();

  useEffect(() => {
    if (open) {
      service
        .get(`videos/${idVideo}/comments?page=1`)
        .then(({ data }) => {
          setDatas(data?.comments?.data ?? []);
          setPage(1);
          setTotalComment(data?.comments_count ?? 0);
          setTotalData(data?.comments?.last_page);
          setIsError(false);
        })
        .catch(() => setIsError(true))
        .finally(() => {
          setIsFetching(false);

          if (divRef.current) divRef.current.scrollIntoView({ behavior: 'instant' });
        });
    }
  }, [open, idVideo]);

  useEffect(() => {
    if (isSuccessAddComment) {
      setDatas([
        ...[
          {
            user: {
              name: user?.name,
              photo: user?.photo
            },
            created_at: new Date(),
            comment: comment,
            isTemporary: true
          }
        ],
        ...datas
      ]);
      setComment('');
      setTotalComment(totalComment + 1);
    }
  }, [isSuccessAddComment]);

  const handleNextPage = (next) => {
    setIsLoading(true);
    service
      .get(`videos/${idVideo}/comments?page=${next}`)
      .then(({ data }) => {
        setDatas([...datas, ...data?.comments?.data]);
        setPage(next);
        setTotalData(data?.comments?.last_page);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    setTotalComment(total);
  }, [total]);

  return (
    <div>
      <div
        className="flex gap-2 items-center text-sm cursor-pointer"
        onClick={() => setOpen(!open)}>
        <img
          src="/assets/icons/comment-icon.svg"
          alt="comment-icon"
          className="w-[16px]"
          loading="lazy"
          width="100%"
          height="100%"
        />
        <button className="text-small">{totalComment}</button>
      </div>
      <BottomSheet
        open={open}
        onDismiss={() => setOpen(false)}
        header={<div className="font-semibold py-2">{`Comment (${totalComment})`}</div>}
        snapPoints={({ maxHeight }) => 0.8 * maxHeight}
        footer={
          <div className="flex items-center gap-2">
            <input
              type="text"
              className="bg-[#535353] text-white w-full px-3 py-2 rounded-md focus:outline-none"
              tabIndex={-1}
              placeholder="Leave a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (isAuthenticated) {
                    addComment({ idVideo: idVideo, idArray: idArray, comment: comment });
                    divRef.current.scrollIntoView({ behavior: 'instant' });
                  } else {
                    setOpen(false);
                    dispatch(setModal({ name: 'modalLogin', value: true }));
                  }
                }
              }}
              disabled={!isAuthenticated || loadingComment}
            />
            <button
              type="submit"
              className="bg-[#FF00FE] text-slate-50 px-3 py-2 rounded-lg"
              disabled={loadingComment}
              onClick={() => {
                if (isAuthenticated) {
                  addComment({ idVideo: idVideo, idArray: idArray, comment: comment });
                  divRef.current.scrollIntoView({ behavior: 'instant' });
                } else {
                  setOpen(false);
                  dispatch(setModal({ name: 'modalLogin', value: true }));
                }
              }}>
              {loadingComment ? (
                <div className="animate-spin rounded-full h-6 w-6 mx-3 border-b-2 border-[#0000FF]"></div>
              ) : (
                'Submit'
              )}
            </button>
          </div>
        }>
        <div className="flex flex-col gap-5 p-4">
          {isFetching && (
            <div className="flex justify-center items-center mt-52">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            </div>
          )}

          {!isFetching && isError && (
            <div className="flex justify-center items-center">
              <p className="text-sm text-red-500">Something went wrong</p>
            </div>
          )}

          {!isFetching && <div ref={divRef} />}

          {datas.length > 0 ? (
            datas.map((item) => (
              <div className="flex gap-4">
                <div className="flex-0">
                  <PhotoProfile
                    image={item?.user?.photo ?? '/assets/images/user.png'}
                    styles="w-12 h-12"
                  />
                  {/* <div className="w-12 h-12 rounded-full cursor-pointer">
                    <img
                      src={item?.user?.photo}
                      onError={(e) => {
                        e.target.src = '/assets/images/user.png';
                      }}
                      alt={item?.user?.name}
                      className="w-full h-full object-cover object-center rounded-full"
                    />
                  </div> */}
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex gap-1 items-center text-xs font-normal">
                    <Username
                      name={item?.user?.contestant?.artist_band_name ?? item?.user?.name}
                      fontStyle="text-xs font-normal"
                    />
                    •{' '}
                    {/* <span className="">{item?.user?.contestant?.artist_band_name ?? item?.user?.name}</span>•{' '} */}
                    {/* <span>&middot;</span> */}
                    <span className="">{moment(item?.created_at).fromNow()}</span>
                  </div>
                  <h3 className="text-base font-semibold m-0">{item?.comment}</h3>
                </div>
              </div>
            ))
          ) : !isFetching ? (
            <EmptyComment />
          ) : null}

          {page < totalData && (
            <button
              className="text-zinc-400 rounded-md focus:outline-none text-sm font-normal flex justify-center"
              onClick={() => {
                const next = page + 1;
                handleNextPage(next);
              }}>
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-200"></div>
              ) : (
                `${t('Load more')}`
              )}
            </button>
          )}
        </div>
      </BottomSheet>
    </div>
  );
}
