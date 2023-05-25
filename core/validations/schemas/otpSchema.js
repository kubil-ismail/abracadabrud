import Joi from 'joi';

const otpSchema = Joi.object({
  otp: Joi.string()
    .length(6)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      'string.empty': 'OTP is required',
      'string.pattern.base': 'OTP must be a number',
      'string.length': 'OTP must be 6 digits'
    })
});

export default otpSchema;
