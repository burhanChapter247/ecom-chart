const httpStatus = require('http-status');
const { Product } = require('../models');
const ApiError = require('../utils/ApiError');

//generate 20 fake products
const generateProducts = async () => {
  if (!await Product.generateProduct()) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Something went wrong');
  }  
};

module.exports = {
    generateProducts
};
