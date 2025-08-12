const mongoose= require('mongoose');
const Schema=mongoose.Schema;

const productSchema=new Schema(
    {
        name:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        imageUrl:{
            type:String,
            required:true
        },
        category:{
            type:String,
            required:true
        },
        stock:{
            type:Number,
            default:0
        },
        owner:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true
        },
    },

);

const Product=mongoose.model('product',productSchema);
module.exports=Product;