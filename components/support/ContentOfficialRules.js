/* eslint-disable max-len */
import React from 'react';
import TabsSupport from './TabsSupport';
import { useTranslation } from 'react-i18next';

export default function ContentOfficialRules({ content }) {
  const { t } = useTranslation();
  return (
    <div className="container py-4">
      <div className="grid grid-cols-1 md:grid-cols-5 md:space-x-12 space-y-8 md:space-y-0">
        <div className="bg-third-accent rounded-lg w-full  h-56 lg:h-64 p-3 bg-[#2B2B2B]">
          <TabsSupport />
        </div>
        <div className="md:col-span-4 bg-third-accent text-slate-50 md:px-5 rounded-md">
          <div className="mt-2 md:mt-0">
            <div className="mb-5 flex flex-col">
              <h6 className="text-xl lg:text-5xl font-bold mb-2">{t('Official Rules')}</h6>
              <span className="text-base">
                {t('Read our official rules below about your rights and responsibilities as a abracadabra user.')}
              </span>
            </div>
            <div dangerouslySetInnerHTML={{ __html: content?.content }} />
          </div>
        </div>
      </div>
    </div>
  );
}
