const express = require("express");
const router = express.Router();
const { OrderController } = require("../controllers");

router.get("/sales-amount", OrderController.salesAmount);
router.get("/sales-percentage", OrderController.compareSales);
router.get("/per-day-order", OrderController.OrderCount);
router.get("/order-diff", OrderController.compareOrderCount);

module.exports = router;
