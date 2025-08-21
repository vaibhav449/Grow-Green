const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const productsRoutes= require('./routes/productsRoutes')
const userRoutes = require('./routes/userRoutes');
const adminRoutes=require('./routes/adminRoutes');
const cartRoutes = require('./routes/cartRoutes');
dotenv.config();
connectDB();

const app = express();
app.use(cors(
    {
        origin: "http://127.0.0.1:5173"
    }
));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/v1/products', productsRoutes);
app.use('/api/v1/user',userRoutes);
app.use('/api/v1/admin',adminRoutes);
app.use('/api/v1/cart', cartRoutes);
// app.get('/api/test', (req, res) => {
//   console.log("test api called");
//   res.json({ message: 'Test API response OK' });
// });


// Mount routers
// const productRoutes = require('./routes/products');
// app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
