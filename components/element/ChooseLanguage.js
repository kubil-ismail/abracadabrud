import { Disclosure } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ChooseLanguage() {
  const { t } = useTranslation();

  const [translateActive, setTranslateActive] = useState([]);
  const router = useRouter();
  const { i18n } = useTranslation();

  return (
    <div>
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button
              className="text-base text-slate-50 cursor-pointer hover:text-[#FF00CA] transition-all delay-100 ease-in-out flex justify-between items-center w-full"
            >
              <div className="text-base text-slate-50 cursor-pointer hover:text-[#FF00CA] transition-all delay-100 ease-in-out flex w-full gap-2 items-center">
                {/* <ImEarth /> */}
                <Image
                  src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/translate-icon.png`}
                  alt="translate"
                  width={20}
                  height={20} />
                <span className="inline-block ml-1">{t('Language')}</span>
              </div>
              <Image
                src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/chevron-down.png`}
                alt="chevron"
                width={24}
                height={24}
                className={`${open ? 'rotate-180 transform' : ''}`}
              />
              {/* <BiChevronUp
                className={`${open ? '' : 'rotate-180 transform'
                } h-5 w-5`}
              /> */}
            </Disclosure.Button>
            <Disclosure.Panel
              className="text-xs lg:text-base text-third-accent flex flex-col gap-2 p-2 bg-second-accent rounded-md mt-3"
            >
              {
                [
                  { id: 1, bahasa: 'Indonesia', locale: 'id', image: `${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/Indonesia_flag.png` },
                  { id: 2, bahasa: 'English', locale: 'en', image: `${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/UK_flag.svg` },
                ].map((data) => (
                  <button type="button" className={data.id === translateActive ? 'text-[#FF00CA] px-1 py-1 rounded-md' : 'text-slate-50 pb-2'}
                    onClick={
                      () => {
                        setTranslateActive(data.id)
                        i18n.changeLanguage(data.locale)
                        router.push(router.asPath, router.asPath, { locale: data.locale })
                        localStorage.setItem('locale', data.locale);
                      }}>
                    <div className="flex items-center space-y-2 m-0">
                      <img src={data.image} alt="flag" className="w-6 h-6 rounded-full object-cover object-center" />
                      <span className="text-xs md:text-sm ml-2">{data.bahasa}</span>
                    </div>
                  </button>
                ))
              }
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}
