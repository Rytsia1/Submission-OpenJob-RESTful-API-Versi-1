// dikerjakan oleh: distania_9

const InvariantError = require('../exceptions/InvariantError');

const validateMiddleware = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return next(new InvariantError(error.message));
  }
  return next();
};

module.exports = validateMiddleware;
