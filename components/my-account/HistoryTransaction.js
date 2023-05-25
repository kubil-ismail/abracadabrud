import { Disclosure, Tab } from '@headlessui/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MembershipTabs from './MembershipTabs';
import VideoTabs from './VideoTabs';
import PointsTabs from './PointsTabs';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function HistoryTransaction() {
  const { t } = useTranslation();
  const { query, push } = useRouter();
  const [selectedTab, setSelectedTab] = useState(0);
  const [valueTabs] = useState([
    { id: 1, name: 'Membership', key: 'membership' },
    { id: 2, name: 'Video', key: 'video' },
    { id: 3, name: 'Points', key: 'points' }
  ]);

  useEffect(() => {
    if (query?.tab) {
      const tab = valueTabs.find((item) => item.key === query.tab);
      if (tab) {
        setSelectedTab(tab.id - 1);
      }
    }
  }, [query]);

  const onSelectedTab = (index) => {
    push(
      {
        pathname: '/my-account',
        hash: 'transaction',
        query: { ...query, tab: valueTabs[index].key }
      },
      undefined,
      {
        scroll: false
      }
    );
  };

  return (
    <Disclosure defaultOpen={Boolean(query?.tab)}>
      {({ open }) => (
        <div id="transaction">
          <Disclosure.Button className="flex w-full justify-between text-left text-sm font-medium focus:outline-none bg-zinc-800 p-3 rounded-md">
            <span className="text-lg text-slate-50 cursor-pointer hover:text-[#FF00CA] transition-all delay-100 ease-in-out font-bold">
              {t('Transaction history')}
            </span>
            <Image
              src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/chevron-down.png`}
              alt="chevron"
              width={26}
              height={26}
              className={`${open ? 'rotate-180 transform' : ''}`}
            />
            {/* <IoIosArrowDown
            className={`${open ? 'rotate-180 transform' : ''} h-5 w-5`}
          /> */}
          </Disclosure.Button>
          <Disclosure.Panel className="text-xs sm:text-sm py-8 md:py-10">
            <div className="flex flex-col space-y-3 mx-3" id="transaction">
              <Tab.Group selectedIndex={selectedTab} onChange={onSelectedTab}>
                <Tab.List className="border-b border-zinc-900 flex flex-row space-x-4">
                  {valueTabs.map((data) => (
                    <Tab
                      key={data.id}
                      className={({ selected }) =>
                        classNames(
                          selected
                            ? 'bg-[#FF00CA] font-semibold px-4 py-2 rounded-full text-sm sm:text-base text-slate-50 focus:outline-none'
                            : 'bg-gray-500/40 px-4 w-32 py-2 rounded-full font-semibold text-sm sm:text-base focus:outline-none'
                        )
                      }>
                      {data?.name}
                    </Tab>
                  ))}
                </Tab.List>
                <Tab.Panels className="mt-5">
                  <Tab.Panel>
                    {(query?.tab === 'membership' || !query?.tab) && <MembershipTabs />}
                  </Tab.Panel>
                  <Tab.Panel>
                    {query?.tab === 'video' && <VideoTabs />}
                  </Tab.Panel>
                  <Tab.Panel>
                    {query?.tab === 'points' && <PointsTabs />}
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </div>
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
}
