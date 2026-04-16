const express = require("express");
const router = express.Router();

const {
  createProduct,
  getProducts,
  getSingleProduct,
  deleteProduct,
} = require("../controllers/product.controller");

const upload = require("../middleware/uploadMiddleware");


// ➤ CREATE PRODUCT
router.post(
  "/create-product",
  (req, res, next) => {
    console.log("CREATE PRODUCT ROUTE HIT ✅");
    next();
  },
  upload.single("image"),
  createProduct
);


// ➤ GET PRODUCTS
router.get("/get-products", getProducts);


// ➤ GET SINGLE PRODUCT
router.get("/get-product/:id", getSingleProduct);


// ➤ DELETE PRODUCT
router.delete("/delete-product/:id", deleteProduct);


module.exports = router;