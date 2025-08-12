const User=require('../models/user')
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const Product=require('../models/products');
// controllers/userController.js
exports.adminSignup = async(req, res) => {
    const {firstName,lastName,email,password,phone}=req.body;
    console.log("admin signup called with data:", req.body);
    if(!firstName || !lastName || !email || !password || !phone) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        let user=await User.find({email:email});
        if(user.length>0) return res.status(400).json({ message: 'User already exists' });
        user=await User.find({phone:phone});
        if(user.length>0) return res.status(400).json({ message: 'User already exists'});
        const name=firstName +" " + lastName;
        const hashedPassword=await bcrypt.hash(password, 10);
        const newUser= new User({
            name,
            email,
            password: hashedPassword,
            phone,
            role:'admin'
        })
        await newUser.save();
        const token=jwt.sign({id:newUser._id,role:newUser.role}, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });
        res.status(201).json({
            message: 'User created successfully',
            success: true,
            user: {
                id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                phone: newUser.phone
            },
            token: token
    });

        

    }
    catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
    
};


exports.addProduct=async(req,res)=>{
    const {name, price, description, category, imageUrl,stock} = req.body;
    const userId = req.userId; // Assuming adminId is set by the authenticateAdmin middleware
    const role=req.role; // Assuming role is set by the authenticateAdmin middleware
    if(role!=='admin') {
        return res.status(403).json({ message: 'Access denied. Only admins can add products.' });
    }
    if(!name || !price || !description || !category || !imageUrl) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    
    try {
        const newProduct = new Product({
            name,
            description,
            price,
            imageUrl,
            category,
            stock: stock || 0, // Default to 0 if not provided
            owner: userId // Assuming the admin who adds the product is the owner
        });
        await newProduct.save();
        res.status(201).json({
            message: 'Product added successfully',
            product: newProduct
        });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
