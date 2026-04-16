
const express = require("express");
const router = express.Router();

const {
  createCategory,
  getCategories,
  deleteCategory,
} = require("../controllers/category.controller");

const upload = require("../middleware/uploadMiddleware");

// ✅ CREATE (Hybrid: JSON + multipart दोनों support करेगा)
router.post(
  "/create-category",
  (req, res, next) => {
    console.log("CREATE CATEGORY ROUTE HIT ✅");
    next();
  },
  (req, res, next) => {
    const contentType = req.headers["content-type"] || "";

    // 👉 Only apply multer if multipart
    if (contentType.includes("multipart/form-data")) {
      return upload.single("image")(req, res, next);
    }

    next();
  },
  createCategory
);


// GET
router.get("/get-categories", getCategories);

// DELETE
router.delete("/delete-category/:id", deleteCategory);


module.exports = router;