const Product = require("../models/product.model");
const sendResponse = require("../utils/sendResponse");
const uploadToCloudinary = require("../utils/cloudinaryUpload");

// ➤ CREATE PRODUCT
exports.createProduct = async (req, res, next) => {
  try {
    console.log("BODY for product:", req.body);
    console.log("FILE:", req.file);

    const {
      name,
      price,
      category,
      brand,
      originalPrice,
      sizes,
      stock,
      description,
      isBestSelling,
      isSelling,
    } = req.body;

    if (!name || !price || !originalPrice) {
      return sendResponse(res, 400, false, "Name & price & originalPrice required");
    }

    let imageData = {};

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);

      imageData = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    // 🔥 ADD THIS (IMPORTANT)
    if (req.body.image) {
      imageData = {
        url: req.body.image,
      };
    }

    const product = await Product.create({
      name,
      originalPrice,
      price,
      category,
      brand,
      description,
      stock,
      isBestSelling,
      sizes: sizes ? sizes.split(",") : [],
      image: imageData,
      isSelling,
    });

    return sendResponse(res, 201, true, "Product created", {
      _id: product._id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image?.url,
      isSelling: product.isSelling,
    });
  } catch (error) {
    next(error);
  }
};

// ➤ GET PRODUCTS (FILTER + PAGINATION)
exports.getProducts = async (req, res, next) => {
  try {
    const {
      category,
      size,
      brand,
      sort,
      page = 1,
      limit = 10,
      isSelling,
      isBestSelling,
    } = req.query;

    let filter = {};

    // ================= CATEGORY
    if (category) {
      filter.category = category;
    }

    // ================= BRAND
    if (brand) {
      filter.brand = brand;
    }

    // ================= SIZE (🔥 FIXED)
    if (size) {
      const sizesArray = size.split(","); // "S,M,L" → ["S","M","L"]
      filter.sizes = { $in: sizesArray };
    }

    if (isSelling) {
      filter.isSelling = isSelling === "true";
    }

    if (isBestSelling) {
      filter.isBestSelling = isBestSelling === "true";
    }

    // ================= QUERY
    let query = Product.find(filter).populate("category", "name");

    // ================= SORTING
    // 🔥 🔹 New → Old
    if (sort === "new") {
      query = query.sort({ createdAt: -1 });
    }

    // 🔥 🔹 Price Low → High
    if (sort === "priceLow") {
      query = query.sort({ price: 1 });
    }

    // 🔥 🔹 Price High → Low
    if (sort === "priceHigh") {
      query = query.sort({ price: -1 });
    }

    // 🔥 🔹 Alphabet A → Z
    if (sort === "az") {
      query = query.sort({ name: 1 });
    }

    // 🔥 🔹 Alphabet Z → A
    if (sort === "za") {
      query = query.sort({ name: -1 });
    }

    // ================= PAGINATION
    const skip = (page - 1) * limit;

    const products = await query.skip(skip).limit(Number(limit));

    return sendResponse(res, 200, true, "Products fetched", products);
  } catch (error) {
    next(error);
  }
};

// ➤ GET SINGLE PRODUCT
exports.getSingleProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");

    if (!product) {
      return sendResponse(res, 404, false, "Product not found");
    }

    return sendResponse(res, 200, true, "Product fetched", product);
  } catch (error) {
    next(error);
  }
};

// ➤ DELETE PRODUCT
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return sendResponse(res, 404, false, "Product not found");
    }

    await Product.findByIdAndDelete(req.params.id);

    return sendResponse(res, 200, true, "Product deleted");
  } catch (error) {
    next(error);
  }
};
