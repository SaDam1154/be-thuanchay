const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.get('/:id', customerController.readOne);
router.get('/', customerController.read);
router.post('/', customerController.create);
router.put('/:id', customerController.update);
router.delete('/:id', customerController.destroy);

module.exports = router;