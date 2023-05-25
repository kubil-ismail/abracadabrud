import { useTranslation } from 'react-i18next';

export default function EmptyPlaceholder({ image, text }) {
  const { t } = useTranslation();
  return (
    <div className="container w-full h-full">
      <div className="flex items-center justify-center w-full h-full">
        <div className="flex flex-col items-center space-y-4">
          <img src={image} alt="" className="w-44" />
          <h3 className="text-base font-bold m-0 text-center">{t(text)}</h3>
        </div>
      </div>
    </div>
  );
}
