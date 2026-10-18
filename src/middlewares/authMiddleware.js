// dikerjakan oleh: distania_9

const AuthenticationError = require('../exceptions/AuthenticationError');
const TokenManager = require('../tokenize/TokenManager');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new AuthenticationError('Missing authentication credential');
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new AuthenticationError('Invalid authentication header format');
    }

    const token = parts[1];
    const decoded = TokenManager.verifyAccessToken(token);

    req.user = decoded;
    req.auth = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleware;
