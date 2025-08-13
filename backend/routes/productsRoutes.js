const express = require('express');
const router = express.Router();
const getSelectedProducts = require('../controllers/products')

// Define the routes for this router
router.get('/', getSelectedProducts );


module.exports = router;