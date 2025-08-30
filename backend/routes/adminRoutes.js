const express = require('express');
const router = express.Router();
const {adminSignup,addProduct,getProductsByOwner,updateProductByOwner,deleteProduct} = require('../controllers/admin');
const { authenticateUser} = require('../middleware/user');


router.post('/signup' ,adminSignup);
router.post('/addProduct', authenticateUser, addProduct);
router.get('/products/:ownerId', authenticateUser, getProductsByOwner);
router.put('/products/:productId', authenticateUser, updateProductByOwner);
router.delete('/products/:productId', authenticateUser, deleteProduct);

module.exports = router;


