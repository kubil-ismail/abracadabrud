import { Disclosure } from '@headlessui/react';
import { pointApi } from 'core/services/rtk/MeServices';
import { useFormik } from 'formik';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { additionalInformationSchema } from 'utils/schemaValidation';
import { useUpdateAdditionalInformationMutation } from 'core/services/rtk/AuthenticationServices';
import { useGetGenresQuery } from 'core/services/rtk/EventServices';
import ErrorMessage from '../error/ErrorMessage';

export default function AdditionalInformation({ me }) {
  const router = useRouter();
  const { t } = useTranslation();
  const [
    updateAdditionalInformation,
    {
      data: additionalInformationData,
      isLoading: additionalInformationLoading,
      error: additionalInformationError,
      isSuccess: additionalInformationSuccess
    }
  ] = useUpdateAdditionalInformationMutation();

  const dataMe = me;

  const { data: dataGenres, isLoading: isLoadingGenres, error: errorGenres } = useGetGenresQuery();

  const [options, setOptions] = useState([]);

  const dispatch = useDispatch();
  const [favoriteMusicGenresErr, setFavoriteMusicGenresErr] = useState('');
  const [genderErr, setGenderErr] = useState('');
  const firstItem = useRef();

  const formik = useFormik({
    initialValues: {
      preferredLanguage: '',
      favoriteMusicGenres: '[]',
      zipCode: '',
      dateOfBirth: '',
      gender: '',
      aboutMe: ''
    },
    validationSchema: additionalInformationSchema,
    onSubmit: (values) => {
      const parsing = {
        ...values,
        favoriteMusicGenres: JSON.parse(values?.favoriteMusicGenres ?? [])
      };

      const isValidGender = formik.values.gender || formik.values.gender !== '-';

      const isValidGenre = JSON.parse(formik.values.favoriteMusicGenres)?.length;

      if (isValidGender && isValidGenre) {
        updateAdditionalInformation(parsing);
      }
    }
  });

  const languageOptions = [
    { value: '1', label: 'Bahasa Indonesia' },
    { value: '2', label: 'English' }
  ];

  // useEffect(() => {
  //   if (isAuthenticated && token) {
  //     me();
  //   }
  // }, [isAuthenticated, token]);

  useEffect(() => {
    if (dataMe) {
      // set default value if data updated
      const pref_genres = JSON.stringify(dataMe?.user?.pref_genres?.map((genre) => genre.id));

      formik.setFieldValue('preferredLanguage', dataMe?.user?.pref_language || '2');
      formik.setFieldValue('favoriteMusicGenres', pref_genres || '[]');
      formik.setFieldValue('zipCode', dataMe?.user?.zip_code || '-');
      formik.setFieldValue('dateOfBirth', dataMe?.user?.dateofbirth || '-');
      formik.setFieldValue('gender', dataMe?.user?.gender || '-');
      formik.setFieldValue('aboutMe', dataMe?.user?.about || '-');
    }
  }, [dataMe]);

  useEffect(() => {
    if (dataGenres) {
      setOptions(
        dataGenres?.genres?.data.map((genre) => ({
          value: genre.id,
          label: genre.name
        }))
      );
    }
  }, [dataGenres]);

  const { i18n } = useTranslation();

  useEffect(() => {
    if (additionalInformationSuccess) {
      toast.success(t('Success update additional information'));

      dispatch(pointApi.util.invalidateTags(['Points', 'Vote']));

      setTimeout(() => {
        if (formik.values?.preferredLanguage === '2') {
          i18n.changeLanguage('en');

          localStorage.setItem('locale', 'en');
          router.push(router.asPath, router.asPath, { locale: 'en' });
        } else {
          i18n.changeLanguage('id');

          localStorage.setItem('locale', 'id');
          router.push(router.asPath, router.asPath, { locale: 'id' });
        }
      }, 2000);
    }

    if (additionalInformationError) {
      toast.error(t('Failed update additional information'));

      if (additionalInformationError?.data?.errors) {
        if (additionalInformationError?.data?.errors?.preferredLanguage) {
          formik.setFieldError(
            'preferredLanguage',
            additionalInformationError?.data?.errors?.preferredLanguage?.[0]
          );
        }
        if (additionalInformationError?.data?.errors?.pref_genre_ids) {
          formik.setFieldError(
            'favoriteMusicGenres',
            additionalInformationError?.data?.errors?.pref_genre_ids?.[0]
          );
        }
        if (additionalInformationError?.data?.errors?.zip_code) {
          formik.setFieldError('zipCode', additionalInformationError?.data?.errors?.zip_code?.[0]);
        }
        if (additionalInformationError?.data?.errors?.dateofbirth) {
          formik.setFieldError(
            'dateOfBirth',
            additionalInformationError?.data?.errors?.dateofbirth?.[0]
          );
        }
        if (additionalInformationError?.data?.errors?.about) {
          formik.setFieldError('aboutMe', additionalInformationError?.data?.errors?.about?.[0]);
        }
      }
    }
  }, [additionalInformationSuccess, additionalInformationError]);

  return (
    <Disclosure>
      {({ open }) => (
        <div>
          <Disclosure.Button className="flex w-full justify-between text-left text-sm font-medium focus:outline-none bg-zinc-800 p-3 rounded-md">
            <span className="text-lg text-slate-50 cursor-pointer hover:text-[#FF00CA] transition-all delay-100 ease-in-out font-bold">
              {t('Additional information')}
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
            <form onSubmit={formik.handleSubmit}>
              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-8 text-slate-50"
                ref={firstItem}>
                <div className="flex flex-col space-y-3">
                  <label className="text-base font-semibold">{t('Preferred Language')}</label>
                  <Select
                    className={`custom-select ${formik.touched.preferredLanguage &&
                      formik?.errors?.preferredLanguage &&
                      'border-2 border-red-500 rounded-lg'
                      }`}
                    options={languageOptions}
                    closeMenuOnScroll
                    value={languageOptions?.find(
                      (item) => item.value === formik.values.preferredLanguage
                    )}
                    onChange={(e) => formik.setFieldValue('preferredLanguage', e?.value)}
                    size="200px"
                    name="preferredLanguage"
                    onBlur={formik.handleBlur}
                    styles={{
                      control: (base) => ({
                        ...base,
                        height: '45px',
                        borderRadius: '0.375rem'
                      }),
                      option: (base, { isSelected }) => ({
                        ...base,
                        backgroundColor: isSelected ? '#1700FF' : 'inherit',
                        color: isSelected ? '#fff !important' : 'inherit'
                      })
                    }}
                  />
                  <ErrorMessage
                    message={t(
                      formik.touched.preferredLanguage && formik?.errors?.preferredLanguage
                    )}
                  />
                </div>
                <div className="flex flex-col space-y-3">
                  <label className="text-base font-semibold">
                    {t('Your favorite music genres')}
                  </label>
                  <Select
                    className={`custom-select ${((formik.touched.favoriteMusicGenres &&
                      formik?.errors?.favoriteMusicGenres) ||
                      favoriteMusicGenresErr) &&
                      'border-2 border-red-500 rounded-lg'
                      }`}
                    options={options}
                    isMulti
                    closeMenuOnScroll
                    size="200px"
                    onChange={(e) => {
                      const value = e?.map((item) => item?.value);

                      if (value?.length) {
                        setFavoriteMusicGenresErr('');
                      }

                      if (!value?.length) {
                        setFavoriteMusicGenresErr('Genre is required');
                      }

                      formik.setFieldValue('favoriteMusicGenres', JSON.stringify(value));
                    }}
                    value={options?.filter((item) =>
                      JSON.parse(formik.values?.favoriteMusicGenres ?? '[]')?.find(
                        (_item) => _item === item?.value
                      )
                    )}
                    name="favoriteMusicGenres"
                    onBlur={formik.handleBlur}
                    styles={{
                      control: (base) => ({
                        ...base,
                        minHeight: '45px',
                        borderRadius: '0.375rem'
                      }),
                      option: (base, { isSelected }) => ({
                        ...base,
                        backgroundColor: isSelected ? '#1700FF' : 'inherit',
                        color: isSelected ? '#fff !important' : 'inherit'
                      })
                    }}
                  />
                  <ErrorMessage
                    message={t(
                      (formik.touched.favoriteMusicGenres && formik?.errors?.favoriteMusicGenres) ||
                      favoriteMusicGenresErr
                    )}
                  />
                </div>
                <div className="flex flex-col space-y-3">
                  <label className="text-base font-semibold">{t('Zip Code')}</label>
                  <input
                    type="number"
                    className={`text-sm bg-white px-4 py-3 text-[#0000FF] rounded-md ${formik.touched.zipCode &&
                      formik?.errors?.zipCode &&
                      'border-2 border-red-500 rounded-lg'
                      }`}
                    placeholder={t('Enter zip code')}
                    name="zipCode"
                    value={formik.values.zipCode}
                    onChange={formik.handleChange}
                    onKeyDown={(e) => {
                      if (e.key === 'e' || e.key === '-') {
                        e.preventDefault();
                      }
                    }}
                    onBlur={formik.handleBlur}
                  />
                  <ErrorMessage message={t(formik.touched.zipCode && formik?.errors?.zipCode)} />
                </div>
                <div className="flex flex-col space-y-3">
                  <label className="text-base font-semibold">{t('Date of Birth')}</label>
                  <input
                    type="date"
                    className={`text-sm bg-white px-4 py-3 text-[#0000FF] rounded-md ${formik.touched.dateOfBirth &&
                      formik?.errors?.dateOfBirth &&
                      'border-2 border-red-500 rounded-lg'
                      }`}
                    // at least 18 years old from now
                    max={
                      new Date(new Date().setFullYear(new Date().getFullYear() - 15))
                        .toISOString()
                        .split('T')[0]
                    }
                    // at most 100 years old from now
                    min={
                      new Date(new Date().setFullYear(new Date().getFullYear() - 100))
                        .toISOString()
                        .split('T')[0]
                    }
                    name="dateOfBirth"
                    value={formik.values.dateOfBirth}
                    onChange={(e) => {
                      formik.setFieldTouched('dateOfBirth');
                      if (e.target.value) {
                        formik.setFieldValue('dateOfBirth', e.target.value);
                      } else {
                        formik.setFieldError('dateOfBirth', 'Date of birth is required');
                      }
                    }}
                  />
                  <ErrorMessage
                    message={t(formik.touched.dateOfBirth && formik?.errors?.dateOfBirth)}
                  />
                </div>
                <div className="md:col-span-2 flex flex-col space-y-3">
                  <label className="text-base font-semibold">{t('Gender')}</label>
                  <div
                    className={`grid grid-cols-4 gap-2 p-3 bg-white rounded-lg text-zinc-900 ${((formik.touched.gender && formik?.errors?.gender) || genderErr) &&
                      'border-2 border-red-500 rounded-lg'
                      }`}>
                    <div className="flex flex-col items-center">
                      <input
                        type="radio"
                        id="Male"
                        name="gender"
                        value="M"
                        defaultChecked={formik.values.gender === 'M'}
                        onClick={(e) => {
                          formik.setFieldValue('gender', e.target.value);
                          setGenderErr('');
                        }}
                      />
                      <label className="text-xs" htmlFor="Male">
                        {t('Male')}
                      </label>
                    </div>
                    <div className="flex flex-col items-center">
                      <input
                        type="radio"
                        id="Female"
                        name="gender"
                        value="F"
                        defaultChecked={formik.values.gender === 'F'}
                        onClick={(e) => {
                          formik.setFieldValue('gender', e.target.value);
                          setGenderErr('');
                        }}
                      />
                      <label className="text-xs" htmlFor="Female">
                        {t('Female')}
                      </label>
                    </div>
                    <div className="flex flex-col items-center">
                      <input
                        type="radio"
                        id="Other"
                        name="gender"
                        value="O"
                        defaultChecked={formik.values.gender === 'O'}
                        onClick={(e) => {
                          formik.setFieldValue('gender', e.target.value);
                          setGenderErr('');
                        }}
                      />
                      <label className="text-xs" htmlFor="Other">
                        {t('Other')}
                      </label>
                    </div>
                    <div className="flex flex-col items-center">
                      <input
                        type="radio"
                        id="Prefer-not-to-say"
                        name="gender"
                        value="P"
                        defaultChecked={formik.values.gender === 'P'}
                        onClick={(e) => {
                          formik.setFieldValue('gender', e.target.value);
                          setGenderErr('');
                        }}
                      />
                      <label className="text-xs text-center" htmlFor="Prefer-not-to-say">
                        {t('Prefer not to say')}
                      </label>
                    </div>
                  </div>
                  <ErrorMessage
                    message={t((formik.touched.gender && formik?.errors?.gender) || genderErr)}
                  />
                </div>
                <div className="md:col-span-2 flex flex-col space-y-3">
                  <label className="text-base font-semibold">{t('About You')}</label>
                  <textarea
                    className={`text-sm bg-white px-4 py-3 text-[#0000FF] rounded-md ${formik.touched.aboutMe &&
                      formik?.errors?.aboutMe &&
                      'border-2 border-red-500 rounded-lg'
                      }`}
                    placeholder={t('Tell us something interesting about yourself.')}
                    name="aboutMe"
                    value={formik.values.aboutMe}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    rows={9}
                  />
                  <ErrorMessage message={t(formik.touched.aboutMe && formik?.errors?.aboutMe)} />
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    className={`px-5 py-2 text-[#4100FF] bg-[#23FF2C] font-bold text-base w-32 rounded-md ${!formik.isValid && 'cursor-not-allowed'
                      }`}
                    onClick={() => {
                      if (!JSON.parse(formik.values.favoriteMusicGenres)?.length) {
                        setFavoriteMusicGenresErr('Genre is required');
                      }

                      if (!formik.values.gender || formik.values.gender === '-') {
                        setGenderErr('Gender is required');
                      }

                      if (formik.errors !== {}) {
                        firstItem.current.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}>
                    {additionalInformationLoading ? 'Loading...' : `${t('Save')}`}
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
