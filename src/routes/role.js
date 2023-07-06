const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

router.get('/:id', roleController.readOne);
router.get('/', roleController.read);
router.post('/', roleController.create);
router.put('/:id', roleController.update);
router.delete('/:id', roleController.destroy);

module.exports = router;
