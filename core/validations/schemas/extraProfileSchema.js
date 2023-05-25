import Joi from 'joi';

const now = new Date();
const minDate = new Date(now.getFullYear() - 12, now.getMonth(), now.getDate());
const maxDate = new Date(now.getFullYear() - 100, now.getMonth(), now.getDate());

const extraProfileSchema = Joi.object({
  photo: Joi.any(),
  gender: Joi.string().required(),
  dateofbirth: Joi.alternatives(
    Joi.date().raw().required().max(minDate).min(maxDate).messages({
      'date.max': 'Age must be between 12 and 100 years old',
      'date.min': 'Age must be between 12 and 100 years old'
    })
  ),
  province_id: Joi.string(),
  city_id: Joi.string(),
  zip_code: Joi.string()
    .regex(/^[0-9]{5}$/)
    .messages({
      'string.pattern.base': 'Postal code should consists 5 characters.',
      'string.empty': 'Postal code should consists 5 characters.'
    })
    .required(),
  banner: Joi.any()

  //   banner: Joi.object({
  //     type: Joi.string().valid('image/png', 'image/jpeg'),
  //   }).required(),
});

export default extraProfileSchema;
