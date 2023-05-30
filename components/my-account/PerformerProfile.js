import { Disclosure } from '@headlessui/react';
import { setCredentials } from 'core/redux/reducers/authenticationSlice';
import { useFormik } from 'formik';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiOutlinePlus } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { performerProfileSchema } from 'utils/schemaValidation';
import { useUpdatePerformerProfileMutation } from 'core/services/rtk/AuthenticationServices';
import { useGetGenresQuery } from 'core/services/rtk/EventServices';
import ErrorMessage from '../error/ErrorMessage';
import InputMember from '../upload-video/InputMember';
import { useSelector } from 'react-redux';

export default function PerformerProfile({ me }) {
  const [options, setOptions] = useState([]);
  const { t } = useTranslation();
  const [countMembers, setCountMembers] = useState(0);
  const [deletedMembers, setDeletedMembers] = useState([]);
  const dispatch = useDispatch();

  const [dataMe, setDataMe] = useState(me);

  const { data: dataGenres, isSuccess: successGenres } = useGetGenresQuery();
  const state = useSelector((state) => state);

  const [
    updatePerformerProfile,
    {
      data: dataUpdatePerformerProfile,
      error: errorUpdatePerformerProfile,
      isLoading: loadingUpdatePerformerProfile,
      isSuccess: successUpdatePerformerProfile
    }
  ] = useUpdatePerformerProfileMutation();

  const formik = useFormik({
    initialValues: {
      artist_band_name: '',
      description: '',
      genre_ids: '[]',
      member_names: '[]',
      member_emails: '[]'
    },
    validationSchema: performerProfileSchema,
    onSubmit: (values) => {
      const parsing = {
        ...values,
        genre_ids: JSON.parse(values?.genre_ids),
        member_emails: JSON.parse(values?.member_emails),
        member_names: JSON.parse(values?.member_names)
      };
      updatePerformerProfile(parsing);
    }
  });

  const [genreErr, setGenreErr] = useState('');

  // add input
  const addInput = (e) => {
    e.preventDefault();
    setCountMembers(countMembers + 1);
  };

  // set array of member names and emails
  const setMemberArray = (e) => {
    // get input with name member_name
    const memberNames = document.getElementsByName('member_name');
    // get input with name member_email
    const memberEmails = document.getElementsByName('member_email');
    // create array of member names
    const memberNamesArray = [];
    // create array of member emails
    const memberEmailsArray = [];

    // push member names to array
    memberNames.forEach((memberName) => {
      const name = memberName?.value;
      memberNamesArray.push(name);
    });

    // push member emails to array
    memberEmails.forEach((memberEmail) => {
      const email = memberEmail?.value;
      memberEmailsArray.push(email);
    });

    formik?.setFieldValue('member_emails', JSON.stringify(memberEmailsArray));
    formik?.setFieldValue('member_names', JSON.stringify(memberNamesArray));
  };

  useEffect(() => {
    if (successGenres) {
      setOptions(
        dataGenres?.genres?.data.map((genre) => ({
          value: genre?.id,
          label: genre?.name
        }))
      );
    }
  }, [successGenres]);

  useEffect(() => {
    if (dataMe) {
      formik?.setFieldValue('artist_band_name', dataMe?.user?.contestant?.artist_band_name ?? '');
      formik?.setFieldValue('description', dataMe?.user?.contestant?.description ?? '');
      formik?.setFieldValue(
        'genre_ids',
        JSON.stringify((dataMe?.user?.contestant?.genres ?? [])?.map((item) => item?.id))
      );
      formik?.setFieldValue(
        'member_names',
        JSON.stringify((dataMe?.user?.contestant?.members ?? [])?.map((item) => item?.name))
      );
      formik?.setFieldValue(
        'member_emails',
        JSON.stringify((dataMe?.user?.contestant?.members ?? [])?.map((item) => item?.email))
      );
      setCountMembers(dataMe?.user?.contestant?.members?.length);
    }
  }, [dataMe]);

  useEffect(() => {
    if (successUpdatePerformerProfile) {
      toast.success(t('Success update your Performer profile'));

      dispatch(
        setCredentials({
          user: dataUpdatePerformerProfile?.data?.user
        })
      );

      setGenreErr('');
    }

    if (errorUpdatePerformerProfile) {
      toast.error(t('Failed update additional information'));

      if (errorUpdatePerformerProfile?.data?.errors?.genre_ids) {
        formik?.setFieldError(
          'genre_ids',
          errorUpdatePerformerProfile?.data?.errors?.genre_ids?.[0]
        );
      }

      if (errorUpdatePerformerProfile?.data?.errors?.artist_band_name) {
        formik?.setFieldError(
          'artist_band_name',
          errorUpdatePerformerProfile?.data?.errors?.artist_band_name?.[0]
        );
      }

      if (errorUpdatePerformerProfile?.data?.errors?.description) {
        formik?.setFieldError(
          'description',
          errorUpdatePerformerProfile?.data?.errors?.description?.[0]
        );
      }
    }
  }, [successUpdatePerformerProfile, errorUpdatePerformerProfile]);

  return (
    <Disclosure>
      {({ open }) => (
        <div>
          <Disclosure.Button className="flex w-full justify-between text-left text-sm font-medium focus:outline-none bg-zinc-800 p-3 rounded-md">
            <span className="text-lg text-slate-50 cursor-pointer hover:text-[#FF00CA] transition-all delay-100 ease-in-out font-bold">
              {t('Performer profile  & Add band member')}
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
            <form onSubmit={formik?.handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-7 text-slate-50">
                <div className="flex flex-col space-y-3">
                  <label className="text-base font-semibold">{t('Band / Artist Name')}</label>
                  <input
                    type="text"
                    className={`text-sm bg-white px-4 py-3 text-[#0000FF] rounded-md ${
                      formik?.touched?.artist_band_name &&
                      formik?.errors?.artist_band_name &&
                      'border-2 border-red-500'
                    }`}
                    placeholder={t('Enter your band/artist name')}
                    name="artist_band_name"
                    value={formik?.values?.artist_band_name}
                    onChange={formik?.handleChange}
                  />
                  <ErrorMessage
                    message={t(
                      formik?.touched?.artist_band_name && formik?.errors?.artist_band_name
                    )}
                  />
                </div>
                <div className="flex flex-col space-y-3">
                  <label className="text-base font-semibold">
                    {t("Band / Artist Music's Genree")}
                  </label>
                  <Select
                    className={`custom-select ${
                      ((formik?.touched?.genre_ids && formik?.errors?.genre_ids) || genreErr) &&
                      'border-2 border-red-500 rounded-lg'
                    }`}
                    options={options}
                    closeMenuOnScroll
                    value={options?.filter((item) =>
                      JSON.parse(formik?.values?.genre_ids ?? '[]')?.find(
                        (_item) => _item === item?.value
                      )
                    )}
                    onChange={(e) => {
                      const value = e?.map((item) => item?.value);

                      if (value?.length) {
                        setGenreErr('');
                      }

                      if (!value?.length) {
                        setGenreErr('Genre is required');
                      }

                      formik?.setFieldValue('genre_ids', JSON.stringify(value));
                    }}
                    isMulti
                    size="200px"
                    name="genre_ids"
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
                      (formik?.touched?.genre_ids && formik?.errors?.genre_ids) || genreErr
                    )}
                  />
                </div>
                <div className="md:col-span-2 flex flex-col space-y-3">
                  <label className="text-base font-semibold">
                    {t('Band / Artist Information')}
                  </label>
                  <textarea
                    className={`text-sm bg-white px-4 py-3 text-[#0000FF] rounded-md ${formik?.touched.description && formik?.errors?.description && "border-2 border-red-500"}`}
                    placeholder={t('Tell us about you or your band.')}
                    name="description"
                    value={formik?.values?.description}
                    onChange={formik?.handleChange}
                    rows={8}
                  />
                  <ErrorMessage
                    message={t(formik?.touched.description && formik?.errors?.description)}
                  />
                </div>

                <div className="md:col-span-2 flex flex-col space-y-3">
                  <label className="text-base text-slate-50 font-semibold mb-5">
                    {t('Add band members (Optional)')}{' '}
                  </label>

                  {Boolean(countMembers) && (
                    <label className="text-base text-slate-50 font-semibold">
                      {t('Band / Artist Name')}
                    </label>
                  )}

                  {[...new Array(countMembers ?? 0)]
                    ?.map((data, i) => i.toString())
                    ?.filter((res) => (deletedMembers?.find((_res) => _res === res) ? null : res))
                    ?.map((i) => {
                      const index = i;
                      return (
                        <InputMember
                          key={i}
                          index={index}
                          setMember={setMemberArray}
                          value1={dataMe?.user?.contestant?.members?.[index]?.name ?? ''}
                          value2={dataMe?.user?.contestant?.members?.[index]?.email ?? ''}
                          onClose={(e) => {
                            // create array of member names
                            const memberNamesArray = JSON.parse(
                              formik?.values?.member_names ?? '[]'
                            )?.filter((val, _index) => (_index?.toString() !== e ? val : null));
                            // create array of member emails
                            const memberEmailsArray = JSON.parse(
                              formik?.values?.member_emails ?? '[]'
                            )?.filter((val, _index) => (_index?.toString() !== e ? val : null));

                            formik?.setFieldValue(
                              'member_emails',
                              JSON.stringify(memberEmailsArray)
                            );
                            formik?.setFieldValue('member_names', JSON.stringify(memberNamesArray));

                            setDeletedMembers([...deletedMembers, ...[e]]);
                          }}
                        />
                      );
                    })}
                </div>
                <button
                  type="button"
                  className="md:col-span-2 flex items-center space-x-3 justify-end mt-2"
                  onClick={addInput}>
                  <span
                    type="button"
                    className="text-sm font-medium"
                    // onClick={removeInput}
                  >
                    {t('add additional member')}
                  </span>
                  <span type="button" className="p-2 border-2 border-black">
                    <AiOutlinePlus />
                  </span>
                </button>

                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    onClick={() => {
                      if (!JSON.parse(formik.values.genre_ids)?.length) {
                        setGenreErr('Genre is required');
                      }
                    }}
                    className={`px-5 py-2 text-[#4100FF] bg-[#23FF2C] font-bold text-base w-32 rounded-md`}>
                    {loadingUpdatePerformerProfile ? 'Loading...' : `${t('Save')}`}
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
