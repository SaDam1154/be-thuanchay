const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/:id', orderController.readOne);
router.get('/', orderController.read);
router.put('/acc/:id', orderController.accept);
router.post('/', orderController.create);
router.put('/:id', orderController.update);
router.delete('/:id', orderController.destroy);

module.exports = router;
