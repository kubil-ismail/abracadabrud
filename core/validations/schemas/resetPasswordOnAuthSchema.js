import Joi from 'joi';
import { joiPasswordExtendCore } from 'joi-password';

const joiPassword = Joi.extend(joiPasswordExtendCore);

const resetPasswordOnAuthSchema = Joi.object({
  new_password: joiPassword
    .string()
    .minOfLowercase(1)
    .minOfUppercase(1)
    .minOfNumeric(1)
    .noWhiteSpaces()
    .min(8)
    .required(),
  new_password_confirmation: Joi.required().valid(Joi.ref('new_password')).messages({
    'any.only': 'Passwords do not match'
  }),
  old_password: Joi.string().required()
});

export default resetPasswordOnAuthSchema;
