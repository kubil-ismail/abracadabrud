import Joi from 'joi';

const registerSchema = Joi.object({
  email: Joi.string().email({ tlds: false }).required(),
  terms_and_conditions: Joi.boolean().valid(true).required().messages({
    'any.only': 'You must agree to the terms and conditions'
  })
});

export default registerSchema;
