const express = require("express"); //import express framework
const app = express(); //create an express application instance //app is your server app 
const cors = require("cors"); //not used cors then block then request 
const errorHandler = require("./middleware/errorHandler");

console.log("app started-----");
app.use((req, res, next) => {
  console.log("RAW REQUEST RECEIVED");
  next();
});
// console.log("raw request pchi ni line")
app.use(express.json()); //convert json into javascript object //parses JSON request body
// console.log("express json pchi ni line")
app.use(express.urlencoded({ extended: true })); //allows nested objects

app.use(cors({ //allow request from any origin
    origin : "http://localhost:5173",
    credentials: true,
}));


app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});


app.use("/api/category",require("./routes/category.routes"));
app.use("/api/product",require("./routes/product.routes"));

app.use("/api/user",require("./routes/user.routes"));

app.use("/api/wishlist",require("./routes/wishlist.routes"));


app.use("/api/productDetails",require("./routes/productDetails.routes"));

app.use("/api/cart",require("./routes/cart.routes"));

app.use("/api/address",require("./routes/address.routes"));

app.use("/api/payment",require("./routes/payment.routes"));

app.use("/api/order",require("./routes/order.routes"));

app.use("/api/profile",require("./routes/profile.routes"));

app.use(errorHandler);

module.exports = app;