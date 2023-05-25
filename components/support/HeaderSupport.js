// /* eslint-disable import/no-unresolved */
/* eslint-disable max-len */
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function HeaderSupport() {
  const { t } = useTranslation();
  return (
    <div className="">
      <h3 className="text-3xl font-bold">{t('Abracadabra Legal Information')}</h3>
    </div>
  );
}
