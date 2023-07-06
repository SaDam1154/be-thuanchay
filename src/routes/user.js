const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/:id', userController.readOne);
router.get('/', userController.read);
router.post('/', userController.create);
router.put('/:id', userController.update);
router.delete('/:id', userController.destroy);

module.exports = router;
