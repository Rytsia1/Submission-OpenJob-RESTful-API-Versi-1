// dikerjakan oleh: distania_9

const express = require('express');
const validateMiddleware = require('../middlewares/validateMiddleware');
const { UserPayloadSchema } = require('../validator/users/schema');

const createUsersRouter = (usersController) => {
  const router = express.Router();

  router.post('/', validateMiddleware(UserPayloadSchema), usersController.postUserHandler);
  router.get('/:id', usersController.getUserByIdHandler);

  return router;
};

module.exports = createUsersRouter;
