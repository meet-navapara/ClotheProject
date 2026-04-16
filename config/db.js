const mongoose = require("mongoose");

const connectDB = async() =>{
    try
    {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB connected");
        
    }
    catch(error)
    {
        console.log("MongoDB error",error.message);
        process.exit(1); // 1 is error failur that is code 
        
    }
};

module.exports = connectDB;