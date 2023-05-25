import { useTranslation } from 'react-i18next';

export default function WinAwesomePrize() {
  const { t } = useTranslation();
  const bg = {
    backgroundImage: `url('${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/bg-images.png')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center,'
  };

  return (
    <div
      className="px-4 py-10 break-words rounded-[20px] bg-cover bg-center"
      id="win-awesome"
      style={bg}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 items-center space-y-4">
        <div className="block md:hidden">
          <img
            src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/prizes-awesome.webp`}
            alt="awesome-prizes"
            className="w-full m-auto"
          />
        </div>
        <div className="md:max-w-md md:m-auto">
          <div className="flex flex-col space-y-3 text-center">
            <h3 className="text-[#23FF2C] text-[40px] font-extrabold text-center leading-[100%]">
              {t('Win awesome prizes every week!')}
            </h3>
            <div className="flex flex-col space-y-5">
              <span className="text-sm font-normal mb-2 inline-block">
                {t('Weekly prize package includes:')}
              </span>
              <ul className="list-none font-normal text-lg text-center md:text-left flex flex-col space-y-2 w-full">
                <li>{t('2 free VIP concert tickets.')}</li>
                <li>{t('Backstage tour.')}</li>
                <li>{t('Meet ‘n greet and selfies with Judika, Rizky Febian, BCL, and Kahitna.')}</li>
                <li>{t('Accommodation and round-trip transport from anywhere in Indonesia.')}</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="hidden md:block">
          <img
            src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/prizes-awesome.webp`}
            alt="awesome-prizes"
            className="w-full m-auto"
          />
        </div>
      </div>
    </div>
    //     </div>
    // </div>
  );
}
