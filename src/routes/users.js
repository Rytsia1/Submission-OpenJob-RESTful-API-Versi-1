// dikerjakan oleh: distania_9

const express = require('express');

const createUsersRouter = (usersController) => {
  const router = express.Router();

  router.post('/', usersController.postUserHandler);
  router.get('/:id', usersController.getUserByIdHandler);

  return router;
};

module.exports = createUsersRouter;
