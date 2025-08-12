const express = require('express');
const router = express.Router();
const getAllProducts = require('../controllers/products')

// Define the routes for this router
router.get('/api/products', getAllProducts );


module.exports = router;