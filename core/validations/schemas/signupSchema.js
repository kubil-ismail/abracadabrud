import Joi from 'joi';

const signupSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: false } })
    .messages({
      'string.empty': 'Email is required'
    }),
  terms_and_condition: Joi.boolean().valid(true).required().messages({
    'any.only': 'You must agree to the terms and conditions'
  })
});

export default signupSchema;
