const productData = [
  {
    name: "Sansevieria Trifasciata (Snake Plant)",
    description: "A very low-maintenance indoor plant known for its air-purifying qualities and striking, upright leaves. It thrives on neglect, making it perfect for beginners.",
    price: 1299,
    imageUrl: "https://via.placeholder.com/400x400.png?text=Snake+Plant",
    category: "Indoor Plants",
    stock: 50,
    owner: "60d0fe4f5311236168a109ca", // Replace with a real User ObjectId from your database
  },
  {
    name: "Ergonomic Hand Trowel",
    description: "A durable, stainless steel hand trowel with a comfortable, non-slip rubber grip. Its ergonomic design reduces hand fatigue. Ideal for planting, transplanting, and weeding.",
    price: 499,
    imageUrl: "https://via.placeholder.com/400x400.png?text=Hand+Trowel",
    category: "Gardening Tools",
    stock: 150,
    owner: "60d0fe4f5311236168a109cb", // Replace with a real User ObjectId
  },
  {
    name: "Classic Terracotta Pot Set (Set of 3)",
    description: "A set of three classic, breathable terracotta pots in 4-inch, 6-inch, and 8-inch sizes. Includes drainage holes and matching saucers to promote healthy root growth.",
    price: 899,
    imageUrl: "https://via.placeholder.com/400x400.png?text=Terracotta+Pots",
    category: "Pots & Planters",
    stock: 80,
    owner: "60d0fe4f5311236168a109ca",
  },
  {
    name: "Organic All-Purpose Potting Mix (5kg)",
    description: "A nutrient-rich, well-aerated blend of cocopeat, compost, and perlite. Provides an ideal growing environment for both indoor and outdoor container plants.",
    price: 349,
    imageUrl: "https://via.placeholder.com/400x400.png?text=Potting+Mix",
    category: "Soil & Fertilizers",
    stock: 200,
    owner: "60d0fe4f5311236168a109cb",
  },
  {
    name: "Monstera Deliciosa (Swiss Cheese Plant)",
    description: "A popular and iconic houseplant with large, beautiful, fenestrated leaves that adds a tropical vibe to any space. A statement piece for any plant lover.",
    price: 1899,
    imageUrl: "https://via.placeholder.com/400x400.png?text=Monstera",
    category: "Indoor Plants",
    stock: 25,
    owner: "60d0fe4f5311236168a109ca",
  },
];

const connectDB = require('../config/db');
// To use this data, you could do something like:
const Product = require('../models/products');
connectDB();
Product.insertMany(productData)
  .then(() => console.log('Data seeded successfully!'))
  .catch(err => console.error('Error seeding data:', err));