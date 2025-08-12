const express = require('express');
const router = express.Router();
const {signup, addToCart}=require('../controllers/userController')
const {login}=require('../controllers/userController')
const {authenticateUser}=require('../middleware/user')
// Define the routes for this router

router.post('/signup',signup);
router.post('/login',login);
router.post('/addToCart',authenticateUser,addToCart);

module.exports = router;