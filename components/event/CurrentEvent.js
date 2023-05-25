// import { useEffect } from 'react';
// import Head from 'next/head';
// import Image from 'next/image';
// import { useGetEventsQuery, useGetEventQuery } from '../../core/services/rtk/EventServices';
// import { useRouter } from 'next/router';
import BannerEvent from './Banner';
// import DetailEvent from './DetailEvent';
import CompetitionDates from './CompetitionDates';
// import WinAwesomePrize from '../faq/WinAwesomePrize';
// import PerformAtWepop from '../faq/PerformAtWepop';
// import HowToWin from '../faq/HowToWin';
import { useTranslation } from 'react-i18next';
// import Tags from './Tags'

export default function CurrentEvent() {
  const { t } = useTranslation();
  return (
    <div className="container">
      <div className="flex flex-col space-y-6">
        <h3 className="font-bold text-2xl text-[#6CFF00]">{t('Current Event')}</h3>
        <div className="flex flex-col space-y-4">
          <BannerEvent />
          <CompetitionDates />
          {/* <WinAwesomePrize />
          <PerformAtWepop />
          <HowToWin /> */}
        </div>
        {/* <Tags /> */}
      </div>
    </div>
  );
}
