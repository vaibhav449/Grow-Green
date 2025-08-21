const User = require('../models/user');

const getCartItems = async(req, res) => {
  try {
    const userRole = req.role;
    if(userRole === 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const id = req.userId;
    const user = await User.findOne({ _id: id });
    const cart = user.cart || [];
    
    // IMPORTANT: Get full product details
    const Product = require('../models/products'); // Note: your model is named 'products.js'
    
    // Map each cart item to get product details
    const populatedItems = await Promise.all(
      cart.map(async (item) => {
        try {
          // Find the product by ID
          const product = await Product.findById(item.p_id);
          
          if (!product) {
            // Handle case where product might have been deleted
            return {
              p_id: item.p_id,
              qty: item.qty,
              name: "Product not found",
              price: 0,
              imageUrl: "https://via.placeholder.com/150?text=Not+Found"
            };
          }
          
          // Return a merged object with cart quantity and product details
          return {
            p_id: item.p_id,
            qty: item.qty,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            description: product.description,
            category: product.category,
            stock: product.stock
          };
        } catch (err) {
          console.error(`Error finding product ${item.p_id}:`, err);
          return null; // Skip invalid items
        }
      })
    );
    
    // Filter out any null items (failed lookups)
    const validItems = populatedItems.filter(item => item !== null);
    
    res.json({ items: validItems });
  } catch (err) {
    console.error("Cart retrieval error:", err);
    res.status(500).json({ message: 'Server error' });
  }
}

const addItem=async (req, res) => {
  try {
    const userRole=req.role;
    if(userRole==='admin') {
        // return saying you cannot perform this action
        return res.status(403).json({ message: 'Access denied' });
    }
    const userId=req.userId;
    const user = await User.findOne({ _id:userId });
    
    // Add or update item
    const id=req.body.p_id;
    console.log("user role",userRole);
    console.log("id: ",id);
    console.log("user :",user);
    // search this
    const itemIndex = user.cart.findIndex(item => item.p_id?.toString() === id );
    if (itemIndex > -1) {
      // Item exists, update quantity
      user.cart[itemIndex].qty++;
    } else {
      // Item doesn't exist, add new item
      user.cart.push({ p_id: id, qty: 1 });
    }
    console.log("handled adding item to cart",user);
    await user.save();
    console.log("user :",user);
    res.json({items:user.cart});
  } catch (err) {
    console.log("Error in adding item to cart", err);
    res.status(500).json({ message: 'Server error' });
  }
}
const updateByQuantity = async (req, res) => {
  try {
    const userRole = req.role;
    if (userRole === 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const userId = req.userId;
    const user = await User.findOne({ _id: userId });
    const { id } = req.params;
    const { qty } = req.body;
    
    // Find and update the item quantity
    const itemIndex = user.cart.findIndex(item => item.p_id?.toString() === id);
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    // Update quantity
    user.cart[itemIndex].qty = parseInt(qty, 10) || 1;
    await user.save();
    
    // IMPORTANT: Populate product details before sending response
    // This is the same code as in getCartItems
    const Product = require('../models/products');
    const populatedItems = await Promise.all(
      user.cart.map(async (item) => {
        try {
          const product = await Product.findById(item.p_id);
          
          if (!product) {
            return {
              p_id: item.p_id,
              qty: item.qty,
              name: "Product not found",
              price: 0,
              imageUrl: "https://via.placeholder.com/150?text=Not+Found"
            };
          }
          
          return {
            p_id: item.p_id,
            qty: item.qty,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            description: product.description,
            category: product.category,
            stock: product.stock
          };
        } catch (err) {
          console.error(`Error finding product ${item.p_id}:`, err);
          return null;
        }
      })
    );
    
    const validItems = populatedItems.filter(item => item !== null);
    
    res.json({ items: validItems });
    
  } catch (err) {
    console.error("Error updating quantity:", err);
    res.status(500).json({ message: 'Server error' });
  }
};
const removeItem= async(req,res)=>{
  try {
    const userRole = req.role;
    if (userRole === 'admin') {
      // return saying you cannot perform this action
      return res.status(403).json({ message: 'Access denied' });
    }
    const userId = req.userId;
    const user = await User.findOne({ _id: userId });
    let cart = user.cart;
    const { id } = req.params;
    const itemIndex = cart.findIndex(item => item.p_id === id);
    if (itemIndex > -1) {
      // Item exists, remove it
      cart.splice(itemIndex, 1);
    }

    await user.save();
    res.json({items:cart});
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}
const clearCart = async (req, res) => {
  try {
    const userRole = req.role;
    if (userRole === 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const userId = req.userId;
    const user = await User.findOne({ _id: userId });
    
    // Clear the cart
    user.cart = [];
    await user.save();
    
    res.json({ items: [] });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add to exports
module.exports = {
  getCartItems,
  addItem,
  updateByQuantity,
  removeItem,
  clearCart
};