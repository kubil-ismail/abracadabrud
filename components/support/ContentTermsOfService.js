/* eslint-disable max-len */
import React from 'react';
import TabsSupport from './TabsSupport';
import { useTranslation } from 'react-i18next';
import styled from 'styles/text.module.scss';

export default function ContentTermsOfService({ content }) {
  const { t } = useTranslation();
  return (
    <div className="container py-4">
      <div className="grid grid-cols-1 md:grid-cols-5 md:space-x-12 space-y-8 md:space-y-0">
        <div className="bg-third-accent rounded-lg w-full  h-56 lg:h-[150px] p-3 bg-[#2B2B2B] md:col-span-1">
          <TabsSupport />
        </div>
        <div className="md:col-span-4 bg-third-accent text-slate-50 md:px-5 rounded-md">
          <div className="mt-2 md:mt-0">
            <div className="mb-5 flex flex-col">
              <h6 className="text-xl lg:text-5xl font-bold mb-2">{t('Terms Of Service')}</h6>
              <span className="text-base">
                {t(
                  'Read our terms of service below about your rights and responsibilities as a abracadabra user.'
                )}
              </span>
            </div>
            <div className={styled.main} dangerouslySetInnerHTML={{ __html: content?.content }} />
          </div>
        </div>
      </div>
    </div>
  );
}
