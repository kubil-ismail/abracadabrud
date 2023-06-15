import { Disclosure } from '@headlessui/react';
import { useUpdateSocialMediaAccountsMutation } from 'core/services/rtk/AuthenticationServices';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

export default function SocialMediaAccounts({ me }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    instagram: '',
    tiktok: '',
    twitter: '',
    facebook: ''
  });

  const [dataMe, setDataMe] = useState(me);
  const [update, { isSuccess, isError, isLoading }] = useUpdateSocialMediaAccountsMutation();

  const onSubmit = (e) => {
    e.preventDefault();
    update(
      Object.fromEntries(
        Object.entries(form).filter(([_, v]) => v !== null && v !== '' && v !== undefined)
      )
    );
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(t('Social media updated'));
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      toast.error(t('Social media failed updated'));
    }
  }, [isError]);

  useEffect(() => {
    if (dataMe?.user_social_media) {
      setForm({
        instagram: dataMe?.user_social_media?.instagram,
        tiktok: dataMe?.user_social_media?.tiktok,
        twitter: dataMe?.user_social_media?.twitter,
        facebook: dataMe?.user_social_media?.facebook
      });
    }
  }, [dataMe]);

  return (
    <Disclosure>
      {({ open }) => (
        <div>
          <Disclosure.Button className="flex w-full justify-between text-left text-sm font-medium focus:outline-none bg-zinc-800 p-3 rounded-md">
            <span className="text-lg text-slate-50 cursor-pointer hover:text-[#FF00CA] transition-all delay-100 ease-in-out font-bold">
              {t('Social media accounts')}
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
            <form onSubmit={onSubmit}>
              <div className="flex flex-col space-y-7">
                <div className="flex items-center gap-5 w-full">
                  <img
                    src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/Instagram-logo.svg`}
                    alt=""
                    className="w-14"
                  />
                  <input
                    type="text"
                    className="text-sm bg-[#fff] px-4 py-3 text-[#0000FF] rounded-md w-full focus:outline-none"
                    placeholder={t('Enter Instagram Account Name')}
                    value={form?.instagram}
                    onChange={(event) =>
                      event?.target?.value?.length >= 0 &&
                      event?.target?.value?.length <= 50 &&
                      setForm({ ...form, instagram: event?.target?.value })
                    }
                  />
                </div>
                <div className="flex items-center gap-5 w-full">
                  <div className="flex items-center justify-center p-2 bg-slate-50 rounded-full w-14 h-14">
                    <img
                      src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/tiktok-logos.svg`}
                      alt=""
                      className="w-14"
                    />
                  </div>
                  <input
                    type="text"
                    className="ml-1 text-sm bg-[#fff] px-4 py-3 text-[#0000FF] rounded-md w-full focus:outline-none"
                    placeholder={t('Enter Tiktok Account Name')}
                    value={form?.tiktok}
                    onChange={(event) =>
                      event?.target?.value?.length >= 0 &&
                      event?.target?.value?.length <= 50 &&
                      setForm({ ...form, tiktok: event?.target?.value })
                    }
                  />
                </div>
                <div className="flex items-center gap-5 w-full">
                  <img
                    src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/twitter-logos.png`}
                    alt=""
                    className="w-14"
                  />
                  <input
                    type="text"
                    className="text-sm bg-[#fff] px-4 py-3 text-[#0000FF] rounded-md w-full focus:outline-none"
                    placeholder={t('Enter Twitter Account Name')}
                    value={form?.twitter}
                    onChange={(event) =>
                      event?.target?.value?.length >= 0 &&
                      event?.target?.value?.length <= 50 &&
                      setForm({ ...form, twitter: event?.target?.value })
                    }
                  />
                </div>
                <div className="flex items-center gap-5 w-full">
                  <img
                    src={`${process.env.NEXT_PUBLIC_ASSET_URL}/assets/images/facebook-logo.png`}
                    alt=""
                    className="w-14"
                  />
                  <input
                    type="text"
                    className="text-sm bg-[#fff] px-4 py-3 text-[#0000FF] rounded-md w-full focus:outline-none"
                    placeholder={t('Enter Facebook Account Name')}
                    value={form?.facebook}
                    onChange={(event) =>
                      event?.target?.value?.length >= 0 &&
                      event?.target?.value?.length <= 50 &&
                      setForm({ ...form, facebook: event?.target?.value })
                    }
                  />
                </div>
                <div className="flex items-end justify-end gap-5">
                  <button
                    type="button"
                    className="px-5 py-2 text-[#4100FF] bg-[#23FF2C] font-bold text-base w-32 rounded-md "
                    onClick={onSubmit}
                    disabled={isLoading}>
                    {isLoading ? t('Loading...') : t('Save')}
                  </button>
                </div>
              </div>
            </form>
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
}
