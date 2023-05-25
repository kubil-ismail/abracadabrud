import Joi from 'joi';

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } })
});

export default forgotPasswordSchema;
