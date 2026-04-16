require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

connectDB();

const PORT = process.env.PORT || 6000;
app.listen(PORT,"0.0.0.0",()=> //start the express server
    console.log(`Server is running on http://localhost:${PORT}`)
)
    
//  MONGO_URL=mongodb://localhost:27017/ClotheProject
// "start": "nodemon server.js",