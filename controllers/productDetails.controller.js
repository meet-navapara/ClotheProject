// // controllers/productController.js
// const Product = require("../models/product.model");


// exports.getProductById = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id)
//       .populate("category");

//     // ❌ product not found
//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found",
//       });
//     }

//     // ✅ normalize images (single → array)
//     let image = [];

//     // if future માં images array હોય
//     if (product.image && product.image.length > 0) {
//       image = product.image.map((img) => img.url || img);
//     }
//     // current schema (single image)
//     else if (product.image?.url) {
//       image = [product.image.url];
//     }

//     // ✅ final response (clean + frontend ready)
//     res.status(200).json({
//       success: true,

//       product: {
//         _id: product._id,
//         name: product.name,
//         description: product.description,
//         price: product.price,
//         originalPrice: product.originalPrice,
//         brand: product.brand,
//         sizes: product.sizes,
//         stock: product.stock,
//         isBestSelling: product.isBestSelling,
//         isSelling: product.isSelling,

//         category: {
//           _id: product.category?._id,
//           name: product.category?.name,
//         },

//         image, // 🔥 important
//       },
//     });

//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };



const Product = require("../models/product.model");

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 🔥 ONLY image FIELD HANDLE
    let images = [];

    if (Array.isArray(product.image) && product.image.length > 0) {
      images = product.image.map((img) => img.url);
    }

    // ✅ FINAL RESPONSE
    res.status(200).json({
      success: true,
      product: {
        _id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice,
        brand: product.brand,
        sizes: product.sizes,
        stock: product.stock,
        isBestSelling: product.isBestSelling,
        isSelling: product.isSelling,

        category: {
          _id: product.category?._id,
          name: product.category?.name,
        },

        images, // ✅ always array
      },
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};