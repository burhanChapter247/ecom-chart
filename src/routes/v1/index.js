const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const productsRoute = require('./product.route');
const ordersRoute = require('./order.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  }
];

const devRoutes = [
  // routes available only in development mode  
  {
    path: '/products',
    route: productsRoute
  },
  {
    path: '/orders',
    route: ordersRoute
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
