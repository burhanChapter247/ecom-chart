const express = require("express");
const router = express.Router();
const { ProductController } = require("../controllers");

router.get("/chart-data", ProductController.chartData);
router.get("/", ProductController.index);
router.post("/", ProductController.store);
router.put("/:id", ProductController.update);
router.delete("/", ProductController.destroy);
router.get("/:id", ProductController.details);

module.exports = router;
