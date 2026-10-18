// dikerjakan oleh: distania_9

const Joi = require('joi');

const PostApplicationPayloadSchema = Joi.object({
  user_id: Joi.string().required(),
  job_id: Joi.string().required(),
  status: Joi.string().optional(),
});

const PutApplicationPayloadSchema = Joi.object({
  status: Joi.string().required(),
});

module.exports = {
  PostApplicationPayloadSchema,
  PutApplicationPayloadSchema,
};
