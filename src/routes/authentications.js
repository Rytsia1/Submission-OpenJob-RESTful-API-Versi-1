// dikerjakan oleh: distania_9

const express = require('express');

const createAuthenticationsRouter = (authenticationsController) => {
  const router = express.Router();

  router.post('/', authenticationsController.postAuthenticationHandler);
  router.put('/', authenticationsController.putAuthenticationHandler);
  router.delete('/', authenticationsController.deleteAuthenticationHandler);

  return router;
};

module.exports = createAuthenticationsRouter;
