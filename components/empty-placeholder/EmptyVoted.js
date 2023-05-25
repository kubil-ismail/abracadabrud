import { useTranslation } from 'react-i18next';

export default function EmptyVoted() {
  const { t } = useTranslation();
  return (
    <div className="container w-full h-full">
      <div className="flex items-center justify-center w-full h-full">
        <div className="flex flex-col items-center space-y-4">
          <img src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/empty-voted.png`} alt="" className="w-44" />
          <h3 className="text-base font-bold m-0">{t("You haven't voted anyone yet.")}</h3>
        </div>
      </div>
    </div>
  );
}
