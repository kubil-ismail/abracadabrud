import { useState } from 'react';
import { MdOutlineHowToVote } from 'react-icons/md';
import { AiOutlineHeart } from 'react-icons/ai';
import { useTranslation } from 'react-i18next';
export default function EngagementInfo({ favorite, votes }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center w-full space-x-5 text-slate-50">
      <div className="flex items-center space-x-7">
        <div className="flex flex-col flex-grow items-center space-y-1">
          <h3 className="text-lg font-bold">{votes}</h3>
          <div className="flex flex-col space-y-1 items-center">
            <MdOutlineHowToVote size={24} />
            <span className="text-[10px]">{t('Votes')}</span>
          </div>
        </div>
        <div className="flex flex-col flex-grow items-center space-y-1">
          <h3 className="text-lg font-bold">{favorite}</h3>
          <div className="flex flex-col space-y-1 items-center">
            <AiOutlineHeart size={24} />
            <span className="text-[10px]">{t('Favorite')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
