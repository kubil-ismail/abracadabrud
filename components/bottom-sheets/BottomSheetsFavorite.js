import { BottomSheet } from 'react-spring-bottom-sheet';
import React, { useEffect, useState } from 'react';
import UserInfo from './UserInfo';
import EmptyFavorite from '../empty-placeholder/EmptyFavorite';
import { eventApi, useAddFavoriteMutation, useGetFavoritesHistoryQuery } from '../../core/services/rtk/EventServices';
import { useDispatch, useSelector } from 'react-redux';
import EmptyFavoriteVideo from 'components/empty-placeholder/EmptyFavoriteVideo';
import { toast } from 'react-toastify';
import { setModal } from 'core/redux/reducers/modalSlice';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

export default function BottomSheetsFavorite({ total = 0, idVideo, stillLoading, isActive, handleFavorite }) {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { locale } = useRouter();
  const { t } = useTranslation();
  const [totalFavorite, setTotalFavorite] = useState(total);
  const [isFavorite, setIsFavorite] = useState(isActive || false);
  const { user, isAuthenticated } = useSelector((state) => state.authentication);
  const [addFavorite, { isSuccess: isSuccessAddFavorite, isLoading }] = useAddFavoriteMutation();
  const {
    data: favoritesHistory,
    isFetching,
    isError
  } = useGetFavoritesHistoryQuery(
    {
      id: idVideo
    },
    {
      skip: stillLoading || !open
    }
  );

  useEffect(() => {
    setTotalFavorite(total);
  }, [total]);

  useEffect(() => {
    setIsFavorite(isActive);
  }, [isActive]);

  useEffect(() => {
    if (isSuccessAddFavorite) {
      dispatch(eventApi.util.invalidateTags([{ type: 'isFavorite', id: idVideo }]));
      dispatch(eventApi.util.invalidateTags([{ type: 'Favorite', id: idVideo }]));
      handleFavorite();
      toast.success(t('Success add to favorite'));
    }
  }, [isSuccessAddFavorite]);

  return (
    <div>
      <div
        className="flex space-x-2 items-center text-sm cursor-pointer"
        disabled={isFavorite || isLoading}
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
          if (!isFavorite) {
            addFavorite({
              idVideo,
            })
          }
        }}>
        <img
          src={`${isFavorite ? `${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/love-icon-active.svg` : `${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/love-icon.svg`
            }`}
          alt="love-icon"
          className="w-[16px]"
          loading="lazy"
          width="100%"
          height="100%"
          style={{
            filter: 'drop-shadow(0px 0px 2px rgb(0 0 0 / 0.7))'
          }}
        />
        <button className="text-small]">{
          new Intl.NumberFormat(locale, {
            notation: totalFavorite >= 10000 ? 'compact' : 'standard',
            compactDisplay: 'short',
            roundingMode: totalFavorite >= 10000 ? 'floor' : 'halfExpand',
            trailingZeroDisplay: 'stripIfInteger',
            maximumFractionDigits: 1
          }).format(totalFavorite)
        }</button>
      </div>
      <BottomSheet
        open={open}
        onDismiss={() => setOpen(false)}
        header={
          <div className="font-semibold py-2">{`Favorite (${new Intl.NumberFormat(locale, {
            notation: totalFavorite >= 10000 ? 'compact' : 'standard',
            compactDisplay: 'short',
            roundingMode: totalFavorite >= 10000 ? 'floor' : 'halfExpand',
            trailingZeroDisplay: 'stripIfInteger',
            maximumFractionDigits: 1
          }).format(favoritesHistory?.data?.length) || new Intl.NumberFormat(locale, {
            notation: 'compact',
            compactDisplay: 'short',
            maximumFractionDigits: 1,
            roundingMode: 'floor'
          }).format(totalFavorite)
            })`}</div>
        }
        snapPoints={({ maxHeight }) => 0.8 * maxHeight}>
        <div className="flex flex-col space-y-5 p-4">
          {isFetching && (
            <div className="flex justify-center items-center mt-52">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            </div>
          )}

          {isError && (
            <div className="flex justify-center items-center">
              <p className="text-sm text-red-500">Something went wrong</p>
            </div>
          )}
          {favoritesHistory?.data?.length > 0 ? (
            favoritesHistory?.data?.map((data) => <UserInfo label="favorite" data={data} />)
          ) : !isFetching ? (
            <EmptyFavoriteVideo />
          ) : null}
        </div>
      </BottomSheet>
    </div >
  );
}
