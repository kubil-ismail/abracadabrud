import { setPoint } from 'core/redux/reducers/pointSlice';
import SSServices from 'core/services/ServerSide/ssServices';
import {
  useMeQuery,
  useUpdateSurveyQuestionMutation
} from 'core/services/rtk/AuthenticationServices';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { surveyQuestionSchema } from 'utils/schemaValidation';
import ErrorMessage from '../error/ErrorMessage';

const selectStyle = {
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
};

// Static data




export default function SurveyQuestions() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const options_1 = [
    { value: 1, label: t('Never') },
    { value: 2, label: t('Once Year') },
    { value: 3, label: t('Once a Month') },
    { value: 4, label: t('More than Once a Month') },
    { value: 5, label: t('Once every 3 months') },
    { value: 6, label: t('Once every 6 months') }
  ];

  const options_2 = [
    { value: 1, label: t('Stadium/Larger Venue') },
    { value: 2, label: t('Smaller and More intimate Venue') },
    { value: 3, label: t('Both') }
  ];

  const options_3 = [
    { value: 1, label: t('Youtube') },
    { value: 2, label: t('Instagram') },
    { value: 3, label: t('Tiktok') },
    { value: 4, label: t('Twitter') },
    { value: 5, label: t('Facebook') },
    { value: 6, label: t('Line') },
    { value: 7, label: t('Other') }
  ];

  const options_4 = [
    { value: 1, label: t('From a friend') },
    { value: 2, label: t('From the artist') },
    { value: 3, label: t('From the news') },
    { value: 4, label: t('From Youtube') },
    { value: 5, label: t('From Instagram') },
    { value: 6, label: t('From Tiktok') },
    { value: 7, label: t('From Twitter') },
    { value: 8, label: t('From Facebook') },
    { value: 9, label: t('From Line') },
    { value: 10, label: t('Other') }
  ];
  const [
    updateSurveyQuestion,
    {
      data: surveyQuestionData,
      isLoading: surveyQuestionLoading,
      error: surveyQuestionError,
      isSuccess: surveyQuestionSuccess
    }
  ] = useUpdateSurveyQuestionMutation();

  const { isAuthenticated, token } = useSelector((state) => state.authentication);
  const { data: dataMe } = useMeQuery(
    {},
    {
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
      refetchOnFocus: true,
      skip: !isAuthenticated || !token
    }
  );

  const formik = useFormik({
    initialValues: {
      answer_1_id: '',
      answer_2_id: '',
      answer_3_id: '',
      answer_4_ids: '[]',
      answer_5_ids: '[]'
    },
    validationSchema: surveyQuestionSchema,
    onSubmit: (values) => {
      const parsing = {
        ...values,
        answer_4_ids: JSON.parse(values?.answer_4_ids ?? []),
        answer_5_ids: JSON.parse(values?.answer_5_ids ?? [])
      };

      updateSurveyQuestion(parsing);
    }
  });

  // useEffect(() => {
  //   if (isAuthenticated && token) {
  //     me();
  //   }
  // }, [isAuthenticated, token]);

  useEffect(() => {
    if (dataMe) {
      // set default value if data updated
      formik.setFieldValue('answer_1_id', dataMe?.user?.survey?.answer_1_id);
      formik.setFieldValue('answer_2_id', dataMe?.user?.survey?.answer_2_id);
      formik.setFieldValue('answer_3_id', dataMe?.user?.survey?.answer_3_id);
      formik.setFieldValue(
        'answer_4_ids',
        JSON.stringify(dataMe?.user?.survey?.answer_4_ids?.split(','))
      );
      formik.setFieldValue(
        'answer_5_ids',
        JSON.stringify(dataMe?.user?.survey?.answer_5_ids?.split(','))
      );
    }
  }, [dataMe]);

  useEffect(() => {
    if (surveyQuestionSuccess) {
      SSServices.getMyPoints({ token, client: true }).then((result) => {
        dispatch(setPoint(result?.data));
        toast.success(t('Success update survey question'));
      });
      // dispatch(pointApi.util.invalidateTags(['Points', 'Vote']));
    }

    if (surveyQuestionError) {
      toast.error('Failed update survey question');

      if (surveyQuestionError?.data?.errors) {
        if (surveyQuestionError?.data?.errors?.answer_1_id) {
          formik.setFieldError('answer_1_id', surveyQuestionError?.data?.errors?.answer_1_id?.[0]);
        }
        if (surveyQuestionError?.data?.errors?.answer_2_id) {
          formik.setFieldError('answer_2_id', surveyQuestionError?.data?.errors?.answer_2_id?.[0]);
        }
        if (surveyQuestionError?.data?.errors?.answer_3_id) {
          formik.setFieldError('answer_3_id', surveyQuestionError?.data?.errors?.answer_3_id?.[0]);
        }
        if (surveyQuestionError?.data?.errors?.answer_4_ids) {
          formik.setFieldError(
            'answer_4_ids',
            surveyQuestionError?.data?.errors?.answer_4_ids?.[0]
          );
        }
        if (surveyQuestionError?.data?.errors?.answer_5_ids) {
          formik.setFieldError(
            'answer_5_ids',
            surveyQuestionError?.data?.errors?.answer_5_ids?.[0]
          );
        }
      }
    }
  }, [surveyQuestionSuccess, surveyQuestionError]);

  return (
    <div className="flex flex-col space-y-7 text-slate-50">
      <form
        onSubmit={formik.handleSubmit}
        id="surver_form"
        className="grid grid-cols-1 md:grid-cols-2 gap-7 md:items-end md:gap-8">
        <div className="flex flex-col gap-3">
          <label className="text-base font-semibold">
            {t('In the past one year, how often do you attend live music performances?')}
          </label>
          <Select
            className="custom-select"
            options={options_1}
            closeMenuOnScroll
            onChange={(e) => formik.setFieldValue('answer_1_id', e?.value)}
            value={options_1?.find((item) => item.value == formik.values.answer_1_id)}
            size="200px"
            name="preferredLanguage"
            onBlur={formik.handleBlur}
            styles={selectStyle}
            required
            tabIndex={-1}
          />
          <ErrorMessage message={t(formik.touched.answer_1_id && formik?.errors?.answer_1_id)} />
        </div>
        <div className="flex flex-col gap-3">
          <label className="text-base font-semibold">
            {t('In the past one year, how often do you attend venues with music by a DJ?')}
          </label>
          <Select
            className="custom-select"
            options={options_1}
            closeMenuOnScroll
            onChange={(e) => formik.setFieldValue('answer_2_id', e?.value)}
            value={options_1?.find((item) => item.value == formik.values.answer_2_id)}
            size="200px"
            name="answer_2_id"
            onBlur={formik.handleBlur}
            styles={selectStyle}
            required
            tabIndex={-1}

          />
          <ErrorMessage message={t(formik.touched.answer_2_id && formik?.errors?.answer_2_id)} />
        </div>
        <div className="flex flex-col gap-3">
          <label className="text-base font-semibold">
            {t('Would you prefer seeing your favorite artists at a larger venue (stadium) or a smaller, more intimate/exclusive venue?')}
          </label>
          <Select
            className="custom-select"
            options={options_2}
            closeMenuOnScroll
            onChange={(e) => formik.setFieldValue('answer_3_id', e?.value)}
            value={options_2?.find((item) => item.value == formik.values.answer_3_id)}
            size="200px"
            name="answer_3_id"
            onBlur={formik.handleBlur}
            styles={selectStyle}
            required
            tabIndex={-1}
          />
          <ErrorMessage message={t(formik.touched.answer_3_id && formik?.errors?.answer_3_id)} />
        </div>
        <div className="flex flex-col gap-3">
          <label className="text-base font-semibold">{t('What social media platforms do you use?')}</label>
          <Select
            className="custom-select"
            options={options_3}
            closeMenuOnScroll
            onChange={(e) => {
              const value = e?.map((item) => item?.value);
              formik.setFieldValue('answer_4_ids', JSON.stringify(value));
            }}
            value={options_3?.filter((item) =>
              JSON.parse(formik.values?.answer_4_ids ?? '[]')?.find((_item) => _item == item?.value)
            )}
            size="200px"
            name="answer_4_ids"
            onBlur={formik.handleBlur}
            styles={selectStyle}
            isMulti
            required
            tabIndex={-1}
          />
          <ErrorMessage message={t(formik.touched.answer_4_ids && formik?.errors?.answer_4_ids)} />
        </div>
        <div className="md:col-span-2 flex flex-col gap-3">
          <label className="text-base font-semibold">{t('How did you hear about us?')}</label>
          <Select
            className="custom-select"
            options={options_4}
            closeMenuOnScroll
            onChange={(e) => {
              const value = e?.map((item) => item?.value);
              formik.setFieldValue('answer_5_ids', JSON.stringify(value));
            }}
            value={options_4?.filter((item) =>
              JSON.parse(formik.values?.answer_5_ids ?? '[]')?.find((_item) => _item == item?.value)
            )}
            size="200px"
            name="answer_5_ids"
            onBlur={formik.handleBlur}
            styles={selectStyle}
            isMulti
            required
            tabIndex={-1}
          />
          <ErrorMessage message={t(formik.touched.answer_5_ids && formik?.errors?.answer_5_ids)} />
        </div>
        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            className={`px-5 py-2 text-[#4100FF] bg-[#23FF2C] font-bold text-base w-32 rounded-md`}>
            {surveyQuestionLoading ? 'Loading...' : `${t('Save')}`}
          </button>
        </div>
      </form>
    </div>
  );
}
