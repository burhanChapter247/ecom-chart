"use strict";
const { ProductModel, OrderModel } = require("../models/index");

/**
 * group orders and get total sale amount (date wise) from last week
 * @param { req, res }
 * @returns JsonResponse
 */
const salesAmount = async (req, res, next) => {
  try {
    // next() or
    let orders = await OrderModel.aggregate([
      {
        $match: {
          orderCreatedAt: {
            $gte: new Date("2021-01-08"),
            $lte: new Date("2021-01-14"),
          },
        },
      },
      {
        $group: {
          _id: "$orderCreatedAt",
          totalSaleAmount: { $sum: "$netAmount" },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Details fatched successfully.",
      data: orders,
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
 * group orders by date and get orders count by per day
 * @param { req, res }
 * @returns JsonResponse
 */
const OrderCount = async (req, res, next) => {
  try {
    // next() or
    let orders = await OrderModel.aggregate([
      {
        $match: {
          orderCreatedAt: {
            $gte: new Date("2021-01-08"),
            $lte: new Date("2021-01-14"),
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$orderCreatedAt" },
          },
          totalOrderCount: { $sum: 1 },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Details fatched successfully.",
      data: orders,
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
 * get sales increase decrease percentage
 * @param { req, res }
 * @returns JsonResponse
 */
const compareSales = async (req, res, next) => {
  try {
    // next() or
    //fetching Past week's (1 week before last week) data
    let ordersPastWeek = await OrderModel.aggregate([
      {
        $match: {
          orderCreatedAt: {
            $gte: new Date("2021-01-01"),
            $lte: new Date("2021-01-07"),
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$orderCreatedAt" },
          },
          totalSaleAmount: { $sum: "$netAmount" },
        },
      },
    ]);

    //fetching Last week's data
    let ordersLastWeek = await OrderModel.aggregate([
      {
        $match: {
          orderCreatedAt: {
            $gte: new Date("2021-01-08"),
            $lte: new Date("2021-01-14"),
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$orderCreatedAt" },
          },
          totalSaleAmount: { $sum: "$netAmount" },
        },
      },
    ]);

    //calculating percent
    let saleAmounPast = 0;
    for (const ord of ordersPastWeek) {
      saleAmounPast += ord.totalSaleAmount;
    }

    let saleAmounLast = 0;
    for (const ord of ordersLastWeek) {
      saleAmounLast += ord.totalSaleAmount;
    }

    let returnData = {
      saleAmounPast,
      saleAmounLast,
    };

    if (saleAmounPast > saleAmounLast) {
      let diffAmt = saleAmounPast - saleAmounLast;
      returnData.percentage = `-${diffAmt / (saleAmounPast / 100)}%`;
    } else if (saleAmounLast > saleAmounPast) {
      let diffAmt = saleAmounLast - saleAmounPast;
      returnData.percentage = `+${diffAmt / (saleAmounPast / 100)}%`;
    } else {
      returnData.percentage = "0%";
    }

    return res.status(200).json({
      success: true,
      message: "Details fatched successfully.",
      data: returnData,
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
 * Get all record
 * @param { req, res }
 * @returns JsonResponse
 */
const index = async (req, res, next) => {
  try {
    // next() or
    return res.status(200).json({
      success: true,
      message: "Data fetched successfully.",
      data: [],
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
 * Create a record
 * @param { req, res }
 * @returns JsonResponse
 */
const store = async (req, res, next) => {
  try {
    // next() or
    return res.status(200).json({
      success: true,
      message: "Data saved successfully.",
      data: [],
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
 * Get only single record
 * @param { req, res }
 * @returns JsonResponse
 */
const details = async (req, res, next) => {
  try {
    // next() or
    return res.status(200).json({
      success: true,
      message: "Details fatched successfully.",
      data: {},
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
 * update a record
 * @param { req, res }
 * @returns JsonResponse
 */
const update = async (req, res, next) => {
  try {
    // next() or
    return res.status(200).json({
      success: true,
      message: "Data updated successfully.",
      data: [],
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
 * Destroy a record
 * @param { req, res }
 * @returns JsonResponse
 */
const destroy = async (req, res, next) => {
  try {
    // next() or
    return res.status(200).json({
      success: true,
      message: "Data deleted successfully.",
      data: [],
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
  OrderCount,
  compareSales,
  salesAmount,
  index,
  store,
  details,
  update,
  destroy,
};
