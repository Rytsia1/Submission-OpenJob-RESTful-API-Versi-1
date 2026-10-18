// dikerjakan oleh: distania_9

const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const validateMiddleware = require('../middlewares/validateMiddleware');
const {
  PostApplicationPayloadSchema,
  PutApplicationPayloadSchema,
} = require('../validator/applications/schema');

const createApplicationsRouter = (applicationsController) => {
  const router = express.Router();

  router.post('/', authMiddleware, validateMiddleware(PostApplicationPayloadSchema), applicationsController.postApplicationHandler);
  router.get('/', authMiddleware, applicationsController.getApplicationsHandler);
  router.get('/user/:userId', authMiddleware, applicationsController.getApplicationsByUserIdHandler);
  router.get('/job/:jobId', authMiddleware, applicationsController.getApplicationsByJobIdHandler);
  router.get('/:id', authMiddleware, applicationsController.getApplicationByIdHandler);
  router.put('/:id', authMiddleware, validateMiddleware(PutApplicationPayloadSchema), applicationsController.putApplicationStatusHandler);
  router.delete('/:id', authMiddleware, applicationsController.deleteApplicationHandler);

  return router;
};

module.exports = createApplicationsRouter;
