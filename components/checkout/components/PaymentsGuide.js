import { Disclosure } from '@headlessui/react';
import { HiChevronDown } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';

export default function PaymentsGuide({ guideList }) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col space-y-5 max-w-2xl md:m-auto mt-3">
      <h3 className="text-lg md:text-xl font-semibold">{t('Payment Steps')}</h3>
      {guideList.map((guide) => (
        <div key={guide.payment_code}>
          <Disclosure>
            {({ open }) => (
              <div>
                <Disclosure.Button className="py-2 text-sm sm:text-base font-bold block border border-zinc-600 w-full px-3 rounded-t-sm">
                  <div className="w-full flex justify-between">
                    <span className="flex items-center space-x-6 font-medium">{t(guide.guide_name)}</span>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/chevron-down.png`}
                      alt="chevron"
                      width={24}
                      height={24}
                      className={`${open ? 'rotate-180 transform' : ''}`}
                    />
                  </div>
                </Disclosure.Button>
                <Disclosure.Panel className="text-third-accent text-sm border-1 border-slate-50 text-left px-3 py-4">
                  <div>
                    <ul>
                      {guide.guide_list.map((value) => (
                        <li className="mb-1 text-third-accent" key={value.id}>
                          {t(value.title)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Disclosure.Panel>
              </div>
            )}
          </Disclosure>
        </div>
      ))}
    </div>
  );
}
