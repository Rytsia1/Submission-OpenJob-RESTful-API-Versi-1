// dikerjakan oleh: distania_9

const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');

const createJobsRouter = (jobsController, bookmarksController) => {
  const router = express.Router();

  router.post('/', authMiddleware, jobsController.postJobHandler);
  router.get('/', jobsController.getJobsHandler);
  router.get('/company/:companyId', jobsController.getJobsByCompanyIdHandler);
  router.get('/category/:categoryId', jobsController.getJobsByCategoryIdHandler);
  router.get('/:id', jobsController.getJobByIdHandler);
  router.put('/:id', authMiddleware, jobsController.putJobByIdHandler);
  router.delete('/:id', authMiddleware, jobsController.deleteJobByIdHandler);

  // Bookmark nested routes under /jobs
  if (bookmarksController) {
    router.post('/:jobId/bookmark', authMiddleware, bookmarksController.postBookmarkHandler);
    router.get('/:jobId/bookmark/:bookmarkId', authMiddleware, bookmarksController.getBookmarkByIdHandler);
    router.delete('/:jobId/bookmark', authMiddleware, bookmarksController.deleteBookmarkHandler);
  }

  return router;
};

module.exports = createJobsRouter;
