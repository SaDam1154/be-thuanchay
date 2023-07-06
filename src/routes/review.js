const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.get('/:id', reviewController.readOne);
router.get('/', reviewController.read);
router.post('/', reviewController.create);
router.put('/:id', reviewController.update);
router.delete('/:id', reviewController.destroy);

module.exports = router;
