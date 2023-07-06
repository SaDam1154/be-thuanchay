const express = require('express');
const router = express.Router();
const textController = require('../controllers/text');

router.get('/:id', textController.readOne);
router.get('/', textController.read);
router.post('/', textController.create);
router.put('/:id', textController.update);
router.delete('/:id', textController.destroy);

module.exports = router;
