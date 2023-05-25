import Joi from 'joi';

const loginSchema = Joi.object({
  identity: Joi.string().required().messages({
    'string.empty': 'Username or email is required'
  }),
  password: Joi.string().min(6).required()
});

export default loginSchema;
