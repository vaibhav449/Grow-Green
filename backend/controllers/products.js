const Products = require('../models/products');

// get all products
const getSelectedProducts = async (req, res) => {
    try {
        const { searchTerm, category, minPrice, maxPrice } = req.query;

        const query = {};

        if (searchTerm) {
            query.name = { $regex: searchTerm, $options: 'i' };
        }
        if (category) {
            query.category = category;
        }
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }

        const products = await Products.find(query).limit(1);
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = getSelectedProducts;
