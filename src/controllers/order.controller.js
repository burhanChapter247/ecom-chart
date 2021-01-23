const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { orderService } = require('../services');

const generateOrders = catchAsync(async (req, res) => {
  const orders = await orderService.generateOrders();
  res.status(httpStatus.CREATED).send(orders);
});

const getOrdersDay = catchAsync(async (req, res) => {    
    const result = await orderService.getOrdersDay();
    res.send(result);
});

const groupOrders = catchAsync(async (req, res) => {    
    const result = await orderService.groupOrders();
    res.send(result);
});

const getSaleAmount = catchAsync(async (req, res) => {
    const result = await orderService.getSaleAmount();
    res.send(result);
});

const compareSales = catchAsync(async (req, res) => {
    const result = await orderService.compareSales();
    res.send(result);
});

const getOrderCount = catchAsync(async (req, res) => {
    const result = await orderService.getOrderCount();
    res.send(result);
});

const compareOrderCount = catchAsync(async (req, res) => {
    const result = await orderService.compareOrderCount();
    res.send(result);
});

module.exports = {
    generateOrders,
    getOrdersDay,
    groupOrders,
    getSaleAmount,
    compareSales,
    getOrderCount,
    compareOrderCount
};
