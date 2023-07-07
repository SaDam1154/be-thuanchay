const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

router.get('/:id', accountController.readOne);
router.get('/', accountController.read);
router.post('/', accountController.create);
router.put('/:id', accountController.update);
router.delete('/:id', accountController.destroy);

module.exports = router;
