// dikerjakan oleh: distania_9

const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const validateMiddleware = require('../middlewares/validateMiddleware');
const { CategoryPayloadSchema } = require('../validator/categories/schema');

const createCategoriesRouter = (categoriesController) => {
  const router = express.Router();

  router.post('/', authMiddleware, validateMiddleware(CategoryPayloadSchema), categoriesController.postCategoryHandler);
  router.get('/', categoriesController.getCategoriesHandler);
  router.get('/:id', categoriesController.getCategoryByIdHandler);
  router.put('/:id', authMiddleware, validateMiddleware(CategoryPayloadSchema), categoriesController.putCategoryByIdHandler);
  router.delete('/:id', authMiddleware, categoriesController.deleteCategoryByIdHandler);

  return router;
};

module.exports = createCategoriesRouter;
