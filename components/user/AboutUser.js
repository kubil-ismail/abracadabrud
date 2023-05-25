import { useState } from 'react';
import EngagementInfo from './EngagementInfo';
import ProfileUser from './ProfileUser';
import { useTranslation } from 'react-i18next';
export default function AboutUser({ about }) {
  const { t } = useTranslation();
  return (
    <div className="container flex flex-col space-y-3">
      <h3 className="text-lg font-bold">{t('About')}</h3>
      <span className="text-sm font-light">
        {about}
      </span>
    </div>
  );
}
