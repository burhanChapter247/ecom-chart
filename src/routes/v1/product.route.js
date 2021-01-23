const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const productController = require('../../controllers/product.controller');

const router = express.Router();

router
  .route('/generate')
  .get(productController.generateProducts);


module.exports = router;