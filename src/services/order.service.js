const httpStatus = require('http-status');
const { Order, Product } = require('../models');
var moment = require("moment");
const ApiError = require('../utils/ApiError');

//generate 20 fake products
const generateOrders = async () => {
  if (!await Order.generateOrder()) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong');
  }
};

/**
 * count orders per day by product SKU
 * @param  
 * @returns {Promise<products>}
 */
const getOrdersDay = async () => {
    let products = await Product.find({}).limit(20);
    let result = [];
    for (const prod of products) {
        let ordercount = await Order.countDocuments({"products.sku": prod.sku});
        result.push({
            title: prod.title,
            sku: prod.sku,
            price: prod.price,
            count: ordercount
        });
    }

    return result;    
};

/**
 * group orders and get total sale amount  
 * @param  
 * @returns {Promise<orders>}
 */
const groupOrders = async () => {
    let orders = await Order.aggregate([
        {
          $group: {
            _id: "$orderCreatedAt",
            totalSaleAmount: { $sum: "$netAmount" }
          }
        }
      ]);
    return orders;
}

/**
 * group orders by date and get total sale amount  
 * @param  
 * @returns {Promise<orders>}
 */
const getSaleAmount = async () => {
    let orders = await Order.aggregate([
        {
          $match: {
            orderCreatedAt: { $gte: new Date("2021-01-08"), $lte: new Date("2021-01-14") },
          }
        },
        {
            $group: {
                _id : { $dateToString: { format: "%Y-%m-%d", date: "$orderCreatedAt" } },
                totalSaleAmount: { $sum: "$netAmount" },
            }
        }        
    ]);

    return orders;
}

/**
 * get sales increase decrease percentage
 * @param  
 * @returns {Promise<orders>}
 */
const compareSales = async () => {

  //fetching Past week's (1 week before last week) data
  let ordersPastWeek = await Order.aggregate([
      {
        $match: {
          orderCreatedAt: { $gte: new Date("2021-01-01"), $lte: new Date("2021-01-07") },
        }
      },
      {
          $group: {
              _id : { $dateToString: { format: "%Y-%m-%d", date: "$orderCreatedAt" } },
              totalSaleAmount: { $sum: "$netAmount" },
          }
      }
  ]);

  //fetching Last week's data
  let ordersLastWeek = await Order.aggregate([
      {
        $match: {
          orderCreatedAt: { $gte: new Date("2021-01-08"), $lte: new Date("2021-01-14") },
        }
      },
      {
          $group: {
              _id : { $dateToString: { format: "%Y-%m-%d", date: "$orderCreatedAt" } },
              totalSaleAmount: { $sum: "$netAmount" },
          }
      }
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
    saleAmounLast
  };

  if(saleAmounPast > saleAmounLast){
    let diffAmt = saleAmounPast - saleAmounLast;
    returnData.percentage = `-${diffAmt / (saleAmounPast / 100)}%`;
  } else if(saleAmounLast > saleAmounPast){
    let diffAmt = saleAmounLast - saleAmounPast;
    returnData.percentage = `+${diffAmt / (saleAmounPast / 100)}%`;
  } else {
    returnData.percentage = "0%";
  }

  return returnData;
}

/**
 * group orders by date and get orders count by per day
 * @param  
 * @returns {Promise<orders>}
 */
const getOrderCount = async () => {
  let orders = await Order.aggregate([
    {
      $match: {
        orderCreatedAt: { $gte: new Date("2021-01-08"), $lte: new Date("2021-01-14") },
      }
    },
    {
      $group: {
          _id : { $dateToString: { format: "%Y-%m-%d", date: "$orderCreatedAt" } },
          totalOrderCount: { $sum: 1 },
      }
    }
  ]);
  
  return orders;
}

/**
 * compare orders count from the past week 
 * @param  
 * @returns {Promise<orders>}
 */
const compareOrderCount = async () => {

  //fetching Past week's (1 week before last week) data
  let orderPast = await Order.aggregate([
    {
      $match: {
        orderCreatedAt: { $gte: new Date("2021-01-01"), $lte: new Date("2021-01-07") },
      }
    },
    {
      $group: {
          _id : { $dateToString: { format: "%Y-%m-%d", date: "$orderCreatedAt" } },
          totalOrderCount: { $sum: 1 },
      }
    }
  ]);

  //fetching Last week's data
  let orderLast = await Order.aggregate([
    {
      $match: {
        orderCreatedAt: { $gte: new Date("2021-01-08"), $lte: new Date("2021-01-14") },
      }
    },
    {
      $group: {
          _id : { $dateToString: { format: "%Y-%m-%d", date: "$orderCreatedAt" } },
          totalOrderCount: { $sum: 1 },
      }
    }
  ]);

  //calculating increase or decrease orders from the past week
  let orderCountPast = 0;
  for (const ord of orderPast) {
    orderCountPast += ord.totalOrderCount;
  }

  let orderCountLast = 0;
  for (const ord of orderLast) {
    orderCountLast += ord.totalOrderCount;
  }

  let returnData = {
    orderCountPast,
    orderCountLast,
    diff: orderCountLast - orderCountPast
  }
  
  return returnData;
}

module.exports = {
  generateOrders,
  getOrdersDay,
  groupOrders,
  getSaleAmount,
  compareSales,
  getOrderCount,
  compareOrderCount
};
