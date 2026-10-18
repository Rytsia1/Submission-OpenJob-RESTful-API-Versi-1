// dikerjakan oleh: distania_9

const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');

const createBookmarksRouter = (bookmarksController) => {
  const router = express.Router();

  router.get('/', authMiddleware, bookmarksController.getBookmarksHandler);

  return router;
};

module.exports = createBookmarksRouter;
