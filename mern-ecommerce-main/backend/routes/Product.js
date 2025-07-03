const express = require('express');
const router = express.Router();
const productController = require("../controllers/Product");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },  
  });
  router.post("/", upload.fields([
    { name: 'images', maxCount: 4 },  
    { name: 'thumbnail', maxCount: 1 } 
  ]), (req, res) => {
    console.log("Form Data (req.body):", req.body);
    console.log("Uploaded Files (req.files):", req.files);
  
    if (!req.files || !req.files.images || req.files.images.length === 0) {
      return res.status(400).json({ message: 'No images uploaded!' });
    }
  
    productController.create(req, res);
  });
router.patch(
  '/:id',
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images', maxCount: 4 }
  ]),
  productController.updateById
);
router.get("/", productController.getAll);
router.get("/:id", productController.getById);
router.delete("/:id", productController.deleteById);
router.patch("/undelete/:id", productController.undeleteById);
module.exports = router;
