const User=require('../models/user')
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const Product=require('../models/products');
const mongoose=require('mongoose');
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

exports.getProductsByOwner = async (req, res) => {
    try {
        const { ownerId } = req.params; // Get owner ID from URL params
        const userRole = req.role;
        console.log("ownerId:", ownerId);
        console.log("userRole:", userRole);
        // Validate presence of ownerId
        if (!ownerId) {
            return res.status(400).json({ message: 'Owner ID is required' });
        }
        // Only admins can view products by any owner
        if (userRole !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin access required.' });
        }
        
        // Validate ownerId format
        if (!mongoose.Types.ObjectId.isValid(ownerId)) {
            return res.status(400).json({ message: 'Invalid owner ID format' });
        }
        
        const products = await Product.find({ owner: ownerId }).sort({ createdAt: -1 });
        
        res.status(200).json({
            message: 'Products retrieved successfully',
            count: products.length,
            products: products
        });
        
    } catch (error) {
        console.error('Error fetching products by owner:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.updateProductByOwner = async (req, res) => {
    try {
        const { productId } = req.params;
        const { name, description, price, stock, category, imageUrl } = req.body;
        const userRole = req.role;
        const userId = req.userId;

        console.log('Update product request:', {
            productId,
            userRole,
            userId,
            updateData: req.body
        });

        // Check if user is admin
        if (userRole !== 'admin') {
            return res.status(403).json({ 
                message: 'Access denied. Admin access required.' 
            });
        }

        // Validate product ID format
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ 
                message: 'Invalid product ID format' 
            });
        }

        // Find the product first
        const existingProduct = await Product.findById(productId);
        if (!existingProduct) {
            return res.status(404).json({ 
                message: 'Product not found' 
            });
        }

        // Optional: Check if the product belongs to the admin (if you want to restrict)
        if (existingProduct.owner.toString() !== userId) {
            return res.status(403).json({ 
                message: 'You can only update your own products' 
            });
        }

        // Validate required fields
        if (!name || !description || !price || !stock || !category) {
            return res.status(400).json({ 
                message: 'All fields are required: name, description, price, stock, category' 
            });
        }

        // Validate price and stock are positive numbers
        if (price <= 0 || stock < 0) {
            return res.status(400).json({ 
                message: 'Price must be positive and stock cannot be negative' 
            });
        }

        // Update the product
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            {
                name: name.trim(),
                description: description.trim(),
                price: parseFloat(price),
                stock: parseInt(stock),
                category: category.trim(),
                imageUrl: imageUrl?.trim() || existingProduct.imageUrl,
                updatedAt: new Date()
            },
            { 
                new: true, // Return the updated document
                runValidators: true // Run schema validations
            }
        );

        console.log('Product updated successfully:', updatedProduct._id);

        res.status(200).json({
            message: 'Product updated successfully',
            product: updatedProduct
        });

    } catch (error) {
        console.error('Error updating product:', error);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                message: 'Validation error', 
                errors 
            });
        }

        res.status(500).json({ 
            message: 'Internal server error' 
        });
    }
};

exports.deleteProduct=async(req,res)=>{
    try {
        const { productId } = req.params;
        const userRole = req.role;
        const userId = req.userId;

        console.log('Delete product request:', {
            productId,
            userRole,
            userId
        });

        // Check if user is admin
        if (userRole !== 'admin') {
            return res.status(403).json({ 
                message: 'Access denied. Admin access required.' 
            });
        }

        // Validate product ID format
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ 
                message: 'Invalid product ID format' 
            });
        }

        // Find the product first
        const existingProduct = await Product.findById(productId);
        if (!existingProduct) {
            return res.status(404).json({ 
                message: 'Product not found' 
            });
        }

        // Optional: Check if the product belongs to the admin (if you want to restrict)
        if (existingProduct.owner.toString() !== userId) {
            return res.status(403).json({ 
                message: 'You can only delete your own products' 
            });
        }

        // Delete the product
        await Product.findByIdAndDelete(productId);

        console.log('Product deleted successfully:', productId);

        res.status(200).json({
            message: 'Product deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ 
            message: 'Internal server error' 
        });
    }
}