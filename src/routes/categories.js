// dikerjakan oleh: distania_9

const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');

const createCategoriesRouter = (categoriesController) => {
  const router = express.Router();

  router.post('/', authMiddleware, categoriesController.postCategoryHandler);
  router.get('/', categoriesController.getCategoriesHandler);
  router.get('/:id', categoriesController.getCategoryByIdHandler);
  router.put('/:id', authMiddleware, categoriesController.putCategoryByIdHandler);
  router.delete('/:id', authMiddleware, categoriesController.deleteCategoryByIdHandler);

  return router;
};

module.exports = createCategoriesRouter;
