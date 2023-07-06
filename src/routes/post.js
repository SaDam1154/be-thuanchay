const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.get('/:id', postController.readOne);

router.put('/:id', postController.update);

router.delete('/:id', postController.destroy);

router.put('/:id', postController.like);

router.put('/:id', postController.unlike);

router.put('/:id', postController.view);

router.get('/', postController.read);

router.post('/', postController.create);

module.exports = router;
