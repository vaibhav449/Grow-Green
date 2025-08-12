const express = require('express');
const router = express.Router();

const {adminSignup,addProduct} = require('../controllers/admin');
const { authenticateUser} = require('../middleware/user');

router.post('/signup' ,adminSignup);
router.post('/addProduct', authenticateUser, addProduct);


module.exports = router;


