const express = require('express');
const router = express.Router();
const { getSelectedProducts, getProductById } = require('../controllers/products');

// Define the routes for this router
router.get('/', getSelectedProducts );
router.get('/:id', getProductById);

module.exports = router;