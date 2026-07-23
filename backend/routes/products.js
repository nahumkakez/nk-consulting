const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const productController = require('../controllers/productController');

router.use(auth);

router.post('/', productController.createProduct);
router.get('/', productController.getProducts);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;