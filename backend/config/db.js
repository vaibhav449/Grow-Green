const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const connectDB = async () =>{

    try {
        const connect= await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("Connected to db");


    }
    catch(err){
        console.error("error connecting to db",err);
    }
}

module.exports=connectDB;
