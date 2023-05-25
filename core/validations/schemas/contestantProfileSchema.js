import Joi from 'joi';

const basicProfileSchema = Joi.object({
  artist_band_name: Joi.string().required(),
  description: Joi.string().required(),
  genre_ids: Joi.array().items(Joi.any()).required(),
  members: Joi.array().items(
    Joi.object({
      member_names: Joi.string().label('Name'),
      member_emails: Joi.string().email({ tlds: false }).label('Email')
    })
  )
  //   members: Joi.object()({
  //     member_names: Joi.array().items(Joi.string(), Joi.number()),
  //     member_emails: Joi.array().items(Joi.string(), Joi.number()),
  //   }),
});

export default basicProfileSchema;
