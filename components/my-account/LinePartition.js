import { useTranslation } from 'react-i18next';

export default function LinePartition({ name }) {
  const { t } = useTranslation()
  return (
    <div className="container w-full h-full">
      <div className="flex justify-between items-center">
        <div className="w-[25%] bg-[#FF00CA] h-1" />
        <span className="text-sm font-semibold text-[#FF00CA] w-full text-center m-auto">
          {t(name)}
        </span>
        <div className="w-[25%] bg-[#FF00CA] h-1" />
      </div>
    </div>
  );
}
