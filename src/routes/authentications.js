// dikerjakan oleh: distania_9

const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const validateMiddleware = require('../middlewares/validateMiddleware');
const {
  PostAuthenticationPayloadSchema,
  PutAuthenticationPayloadSchema,
  DeleteAuthenticationPayloadSchema,
} = require('../validator/authentications/schema');

const createAuthenticationsRouter = (authenticationsController) => {
  const router = express.Router();

  router.post('/', validateMiddleware(PostAuthenticationPayloadSchema), authenticationsController.postAuthenticationHandler);
  router.put('/', validateMiddleware(PutAuthenticationPayloadSchema), authenticationsController.putAuthenticationHandler);
  router.delete('/', authMiddleware, validateMiddleware(DeleteAuthenticationPayloadSchema), authenticationsController.deleteAuthenticationHandler);

  return router;
};

module.exports = createAuthenticationsRouter;
