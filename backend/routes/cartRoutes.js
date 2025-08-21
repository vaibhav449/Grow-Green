const express=require('express');
const router=express.Router();
const  { authenticateUser }=require('../middleware/user');
const {getCartItems,removeItem,updateByQuantity,clearCart}=require('../controllers/cart');
const { addItem } = require('../controllers/cart');
router.post('/items',authenticateUser,addItem);
router.delete('/items/:id',authenticateUser,removeItem);
router.patch('/items/:id',authenticateUser,updateByQuantity);
router.get('/', authenticateUser, getCartItems);
router.delete('/', authenticateUser, clearCart);

module.exports = router;
