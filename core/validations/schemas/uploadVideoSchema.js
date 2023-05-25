import Joi from 'joi';

const uploadVideoSchema = Joi.object({
  caption: Joi.string().required(),
  video_url: Joi.string().required(),
  genre_ids: Joi.array().items(Joi.any()).required(),
  artist_id: Joi.number().required()
});

export default uploadVideoSchema;
