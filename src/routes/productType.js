const express = require('express');
const router = express.Router();
const productTypeController = require('../controllers/productTypeController');

router.get('/:id', productTypeController.readOne);
router.get('/', productTypeController.read);
router.post('/', productTypeController.create);
router.put('/:id', productTypeController.update);
router.delete('/:id', productTypeController.destroy);

module.exports = router;
