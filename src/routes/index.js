const express = require('express');
const router = express.Router();
const productRoute = require('./product');
const postRoute = require('./post');
const productTypeRoute = require('./productType');
const categoryRoute = require('./category');
const customerRoute = require('./customer');
const orderRoute = require('./order');
const detailOrder = require('./detailOrder');
const user = require('./user');
const role = require('./role');
const auth = require('./auth');
const func = require('./function');

router.use('/product', productRoute);
router.use('/post', postRoute);
router.use('/product-type', productTypeRoute);
router.use('/categories', categoryRoute);
router.use('/customer', customerRoute);
router.use('/order', orderRoute);
router.use('/detail-order', detailOrder);
router.use('/user', user);
router.use('/role', role);
router.use('/auth', auth);
router.use('/function', func);

module.exports = router;
