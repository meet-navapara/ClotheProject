
const Category = require("../models/category.model");
const sendResponse = require("../utils/sendResponse");
const uploadToCloudinary = require("../utils/cloudinaryUpload");

// ➤ CREATE CATEGORY (Supports file + URL)
exports.createCategory = async (req, res, next) => {
  try {
    console.log(req.body, "BODY category---");
    console.log(req.body.image, "IMAGE category---");

    const { name, image } = req.body;
    console.log(name, "name category---");
    console.log(image, "image category---");

    if (!name) {
      return sendResponse(res, 400, false, "Name required");
    }

    let imageData = {};

    // ✅ CASE 1: File upload
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);

      imageData = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    // ✅ CASE 2: Image URL (JSON request)
    else if (image) {
      imageData = {
        url: image,
        public_id: null,
      };
    }

    const category = await Category.create({
      name,
      image: imageData,
    });

    return sendResponse(res, 201, true, "Category created", {
      _id: category._id,
      name: category.name,
      image: category.image?.url,
    });

  } catch (error) {
    next(error);
  }
};



// ➤ GET ALL CATEGORIES
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();

    const formatted = categories.map((cat) => ({
      _id: cat._id,
      name: cat.name,
      image: cat.image?.url,
    }));

    return sendResponse(res, 200, true, "Categories fetched", formatted);

  } catch (error) {
    next(error);
  }
};




// ➤ DELETE CATEGORY
exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return sendResponse(res, 404, false, "Category not found");
    }

    await Category.findByIdAndDelete(id);

    return sendResponse(res, 200, true, "Category deleted");

  } catch (error) {
    next(error);
  }
};
