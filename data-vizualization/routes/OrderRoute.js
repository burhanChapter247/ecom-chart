const express = require("express");
const router = express.Router();
const { OrderController } = require("../controllers");

router.get("/sales-amount", OrderController.salesAmount);
router.get("/sales-percentage", OrderController.compareSales);
router.get("/per-day-order", OrderController.OrderCount);
router.get("/", OrderController.index);
router.post("/", OrderController.store);
router.put("/:id", OrderController.update);
router.delete("/", OrderController.destroy);
router.get("/:id", OrderController.details);

module.exports = router;
