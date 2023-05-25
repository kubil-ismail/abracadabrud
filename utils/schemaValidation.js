import * as yup from 'yup';

export const additionalInformationSchema = yup.object({
  zipCode: yup
    .string('Postal code is required')
    .matches(/^[0-9]+$/, 'Postal code is required')
    .min(5, 'Postal code should consists 5 characters')
    .max(5, 'Postal code should consists 5 characters')
    .required('Postal code is required'),
  aboutMe: yup
    .string('About you is required')
    .min(10, 'About you should be of minimum 10 characters length')
    .max(570, 'About you should be of minimum 570 characters length')
    .required('About you is required'),
  dateOfBirth: yup
    .date('Date is not valid')
    .typeError('Date of birth is required')
    .required('Date of birth is required'),
  gender: yup.string('Gender is invalid').required('Gender is required'),
  preferredLanguage: yup
    .string('Preferred Language is invalid')
    .required('Preferred Language is required'),
  favoriteMusicGenres: yup
    .string('Favorite music genres at least 1')
    .required('Favorite music genres at least 1')
});

export const performerProfileSchema = yup.object({
  artist_band_name: yup
    .string('Band / Artist Name is required')
    .required('Band / Artist Name is required'),
  description: yup
    .string('Band / Artist Information is required')
    .required('Band / Artist Information is required'),
  genre_ids: yup
    .string("Band / Artist Music's Genree is required")
    .required("Band / Artist Music's Genree is required"),
  member_emails: yup.string(),
  member_names: yup.string()
});

export const surveyQuestionSchema = yup.object({
  answer_1_id: yup.string('Please choose your answer').required('Please choose your answer'),
  answer_2_id: yup.string('Please choose your answer').required('Please choose your answer'),
  answer_3_id: yup.string('Please choose your answer').required('Please choose your answer'),
  answer_4_ids: yup.string('Please choose your answer').required('Please choose your answer'),
  answer_5_ids: yup.string('Please choose your answer').required('Please choose your answer')
});
