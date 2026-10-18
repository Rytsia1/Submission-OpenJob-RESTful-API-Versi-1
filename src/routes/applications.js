// dikerjakan oleh: distania_9

const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');

const createApplicationsRouter = (applicationsController) => {
  const router = express.Router();

  router.post('/', authMiddleware, applicationsController.postApplicationHandler);
  router.get('/', authMiddleware, applicationsController.getApplicationsHandler);
  router.get('/user/:userId', authMiddleware, applicationsController.getApplicationsByUserIdHandler);
  router.get('/job/:jobId', authMiddleware, applicationsController.getApplicationsByJobIdHandler);
  router.get('/:id', authMiddleware, applicationsController.getApplicationByIdHandler);
  router.put('/:id', authMiddleware, applicationsController.putApplicationStatusHandler);
  router.delete('/:id', authMiddleware, applicationsController.deleteApplicationHandler);

  return router;
};

module.exports = createApplicationsRouter;
