// dikerjakan oleh: distania_9

const Joi = require('joi');

const APPLICATION_STATUSES = ['pending', 'accepted', 'rejected'];

const PostApplicationPayloadSchema = Joi.object({
  user_id: Joi.string().required(),
  job_id: Joi.string().required(),
  status: Joi.string().valid(...APPLICATION_STATUSES).optional(),
});

const PutApplicationPayloadSchema = Joi.object({
  status: Joi.string().valid(...APPLICATION_STATUSES).required(),
});

module.exports = {
  PostApplicationPayloadSchema,
  PutApplicationPayloadSchema,
};
