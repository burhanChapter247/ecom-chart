const mongoose = require('mongoose');
const faker = require('faker');
var moment = require('moment');
const { Product } = require('./index');
const orderSchema = mongoose.Schema(
  {
    shipping: {},
    payment: {},
    products: [
        {
            quantity: {
                type: Number,
                required: true        
            },
            sku: {
                type: String,
                required: true        
            },
            title: {
                type: String,
                required: true        
            },
            price: {
              type: Number,
              required: true
            },
            amount: {
                type: Number,
                required: true        
            }
        }
    ],
    netAmount: {
      type: Number,      
    },
    orderCreatedAt: {
      type: Date
    }
  },
  {
    timestamps: true,
  }
);


//generate fake orders
orderSchema.statics.generateOrder = async function () {
  
  let orders = [];
  for (let i = 1; i <= 5; i++) {
    let products = [];
    let netAmount = 0;
    for (let j = 1; j <= 3; j++) {
      let product = await Product.getRandom();
      let qty = Math.floor(Math.random() * 5) + 1;
      netAmount += qty * product.price;
      products.push({
        quantity: qty,
        sku: product.sku,
        title: product.title,
        price: product.price,
        amount: qty * product.price
      });
    }

    let days = Math.floor(Math.random() * 14);
    orders.push({
      products: products,
      orderCreatedAt: moment("2021-01-01", "YYYY-MM-DD").add(days, 'days').format("YYYY-MM-DD"),
      netAmount: netAmount
    });
  }


  const order = await this.insertMany(orders);
  return !!order;
};

/**
 * @typedef Order
 */
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
