const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const orderController = require('../../controllers/order.controller');

const router = express.Router();

router
  .route('/generate')
  .get(orderController.generateOrders);

router
  .route('/orders-by-day')
  .get(orderController.getOrdersDay);
  
router
  .route('/group-orders')
  .get(orderController.groupOrders);

router
  .route('/get-sales-amount')
  .get(orderController.getSaleAmount);

router
  .route('/get-sales-percentage')
  .get(orderController.compareSales);

router
  .route('/get-orders-count-day')
  .get(orderController.getOrderCount);

router
  .route('/compare-orders')
  .get(orderController.compareOrderCount);

module.exports = router;