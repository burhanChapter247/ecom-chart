const mongoose = require('mongoose');
const faker = require('faker');
const { toJSON, paginate } = require('./plugins');
const productSchema = mongoose.Schema(
  {
    sku: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    quantity: {
      type: Number,
      required: true
    },    
    price: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true,
  }
);


//generate fake products
productSchema.statics.generateProduct = async function () {
  let products = [];

  for (let i = 1; i <= 20; i++) {
    products.push({
      sku: 000+i,
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      quantity: 20,
      price: faker.commerce.price(),
    });
  }  
  

  const prod = await this.insertMany(products);
  return !!prod;
};

//get random product
productSchema.statics.getRandom = async function () {
  var count = await this.count();
  return await this.findOne().skip(Math.floor(Math.random() * count));  
};


/**
 * @typedef Product
 */
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
