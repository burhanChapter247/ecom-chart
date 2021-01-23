"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderModelSchema = new Schema({
  shipping: {},
  payment: {},
  products: [
    {
      quantity: {
        type: Number,
        required: true,
      },
      sku: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
    },
  ],
  netAmount: {
    type: Number,
  },
  orderCreatedAt: {
    type: Date,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

OrderModelSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

OrderModelSchema.pre("update", function () {
  this.update({}, { $set: { updatedAt: Date.now() } });
});

OrderModelSchema.pre("findOneAndUpdate", function () {
  this.update({}, { $set: { updatedAt: Date.now() } });
});

module.exports = mongoose.model("order", OrderModelSchema);
