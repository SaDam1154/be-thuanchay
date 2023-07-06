const express = require('express');
const router = express.Router();
const functionController = require('../controllers/functionController');

router.get('/', functionController.read);

module.exports = router;
