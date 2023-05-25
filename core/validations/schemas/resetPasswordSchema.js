import Joi from 'joi';
import { joiPasswordExtendCore } from 'joi-password';

const joiPassword = Joi.extend(joiPasswordExtendCore);

const resetPasswordSchema = Joi.object({
  password: joiPassword
    .string()
    .minOfLowercase(1)
    .minOfUppercase(1)
    .minOfNumeric(1)
    .noWhiteSpaces()
    .min(8)
    .required(),
  password_confirmation: Joi.string().min(8).required().valid(Joi.ref('password')).messages({
    'any.only': 'Passwords do not match'
  })
});

export default resetPasswordSchema;
