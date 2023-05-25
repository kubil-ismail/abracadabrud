import Joi from 'joi';
import { joiPasswordExtendCore } from 'joi-password';

const joiPassword = Joi.extend(joiPasswordExtendCore);

const schema = {
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  username: Joi.string().required(),
  email: Joi.string().email({ tlds: false }).required(),
  phone: Joi.string().required().min(10).max(13),
  password: joiPassword
    .string()
    .minOfLowercase(1)
    .minOfUppercase(1)
    .minOfNumeric(1)
    .noWhiteSpaces()
    .min(8)
    .required(),
  password_confirmation: Joi.string().required().valid(Joi.ref('password')).messages({
    'any.only': 'Passwords do not match'
  }),
  referral_code: Joi.string().allow(null, ''),
  pref_genre_ids: Joi.array().items(Joi.number()).required()
};

const basicProfileSchema = Joi.object(schema);

export const basicProfileWithOptionalPasswordSchema = Joi.object({
  ...schema,
  password: joiPassword
    .string()
    .minOfLowercase(1)
    .minOfUppercase(1)
    .minOfNumeric(1)
    .noWhiteSpaces()
    .min(8)
    .allow(null, ''),
  password_confirmation: Joi.string().allow(null, '').valid(Joi.ref('password')).messages({
    'any.only': 'Passwords do not match'
  })
});

export default basicProfileSchema;
