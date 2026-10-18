// dikerjakan oleh: distania_9

const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');

const createProfilesRouter = (profilesController) => {
  const router = express.Router();

  router.get('/', authMiddleware, profilesController.getProfileHandler);
  router.get('/applications', authMiddleware, profilesController.getProfileApplicationsHandler);
  router.get('/bookmarks', authMiddleware, profilesController.getProfileBookmarksHandler);

  return router;
};

module.exports = createProfilesRouter;
