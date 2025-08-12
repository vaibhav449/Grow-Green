const mongoose = require('mongoose');
const Schema = mongoose.Schema; // Or destructure: const { Schema } = mongoose;

// Define your schema
const userSchema = new Schema({
    name: {
        type: String,
        required: true // Example: 'name' field is required
    },
    email: {
        type: String,
        required: true,
        unique: true // Example: 'email' must be unique
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    cart: [ // Define the cart as an array of a specific object structure
        {
            p_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product', // This is a reference to your Product model
                required: true
            },
            qty: {
                type: Number,
                required: true,
                default: 1
            }
        }
    ],
   address: {
    type: String,
   },
   orderHistory: [
    {
        orderId :{
            type: mongoose.Schema.Types.ObjectId,
            ref:'Order'
        }
    }
   ] ,
   phone:{
    type: String,
    required: true,
    unique: true // Ensure phone numbers are unique
   }
});

// create the model
const User = mongoose.model('User', userSchema);

module.exports = User;