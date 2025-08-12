const User=require('../models/user');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
// controllers/userController.js
exports.signup = async(req, res) => {
    const {firstName,lastName,email,password,phone}=req.body;
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
            phone
        })
        await newUser.save();
        const token=jwt.sign({id:newUser._id,role:"user"}, process.env.JWT_SECRET, {
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

// login logic 
exports.login = async(req,res)=>{
    const {email, password} = req.body;
    if(!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const user = await User.findOne({email: email});
        if(!user) return res.status(400).json({ message: 'User does not exist' });
        
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({id: user._id,role:user.role}, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.status(200).json({
            message: 'Login successful',
            success: true,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone
            },
            token: token
        });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.addToCart= async(req,res)=>{
    const { productId, quantity} = req.body;
    const userId = req.userId; // Assuming userId is set by the authenticateUser middleware
    const role=req.role; // Assuming role is set by the authenticateUser middl
    if(role!=='user') {
        return res.status(403).json({ message: 'Access denied. Only users can add items to cart.' });
    }
    if(!userId || !productId || !quantity) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({ message: 'User not found' });

        const existingItem = user.cart.find(item => item.p_id.toString() === productId);
        if(existingItem) {
            existingItem.qty += quantity;
        } else {
            user.cart.push({p_id: productId, qty: quantity});
        }

        await user.save();
        res.status(200).json({ message: 'Item added to cart successfully', cart: user.cart });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
