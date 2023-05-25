import Joi from 'joi';

const surveySchema = Joi.object({
  answer_1_id: Joi.object().required(),
  answer_2_id: Joi.object().required(),
  answer_3_id: Joi.object().required(),
  answer_4_ids: Joi.array().items(Joi.any()).required(),
  answer_5_ids: Joi.array().items(Joi.any()).required()
});

export default surveySchema;
