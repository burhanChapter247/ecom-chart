"use strict";

const { ProductModel, OrderModel } = require("../models/index");

/**
 * Get product chart data
 * @param { req, res }
 * @returns JsonResponse
 */
const chartData = async (req, res, next) => {
  try {
    // next() or
    let products = await ProductModel.aggregate([
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "products",
          as: "inventory_docs",
        },
      },
      {
        $project: {
          _id: 0,
          title: "$title",
          numOfOrders: { $size: "$inventory_docs" },
          products: "$inventory_docs",
        },
      },
    ]);

    /* let products = await ProductModel.find({}).limit(20);
    let result = [];
    for (const prod of products) {
      let ordercount = await OrderModel.countDocuments({
        "products.sku": prod.sku,
      });
      result.push({
        title: prod.title,
        sku: prod.sku,
        price: prod.price,
        count: ordercount,
      });
    } */

    return res.status(200).json({
      success: true,
      message: "Details fatched successfully.",
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "We are having some error while completing your request. Please try again after some time.",
      error: error,
    });
  }
};

/**
 * Export as a single common js module
 */
module.exports = {
  chartData,
};
