const products=require('../models/products');

// get all products
const getAllProducts=async (req,res)=>{
    try {
        const prodcuts=await products.find({});
        res.status(200).json(prodcuts);
    }
    catch(err) {
        console.log(err);
        res.status(500).json({message: 'Internal Server Error'});
    }
}

module.exports= getAllProducts;
