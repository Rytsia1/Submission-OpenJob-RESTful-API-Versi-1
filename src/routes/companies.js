// dikerjakan oleh: distania_9

const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');

const createCompaniesRouter = (companiesController) => {
  const router = express.Router();

  router.post('/', authMiddleware, companiesController.postCompanyHandler);
  router.get('/', companiesController.getCompaniesHandler);
  router.get('/:id', companiesController.getCompanyByIdHandler);
  router.put('/:id', authMiddleware, companiesController.putCompanyByIdHandler);
  router.delete('/:id', authMiddleware, companiesController.deleteCompanyByIdHandler);

  return router;
};

module.exports = createCompaniesRouter;
