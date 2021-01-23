const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { productService } = require('../services');

const generateProducts = catchAsync(async (req, res) => {
  const prods = await productService.generateProducts();
  res.status(httpStatus.CREATED).send(prods);
});

module.exports = {
    generateProducts
};
