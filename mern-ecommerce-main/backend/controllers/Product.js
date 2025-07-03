const Product = require("../models/Product");

exports.create = async (req, res) => {
  try {
    const images = req.files.images ? req.files.images.map(file => file.path) : [];
    const thumbnail = req.files.thumbnail ? req.files.thumbnail[0].path : null;  

    console.log("Uploaded images:", images);
    console.log("Uploaded thumbnail:", thumbnail);

    const created = new Product({
      ...req.body,
      images: images,
      thumbnail: thumbnail, 
    });
    await created.save();
    res.status(201).json(created); 
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: 'Error adding product, please try again later' });
  }
};

const baseUrl = 'http://localhost:8000/';
const addBaseUrl = (url) => {
  if (!url) return null;
  return url.startsWith('http') ? url : baseUrl + url;
};

const stripBaseUrl = (url) => {
  if (!url) return null;
  return url.replace(baseUrl, '');
};
exports.getAll = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("brand")
      .populate("category");

    const productsWithFullUrls = products.map(product => ({
      ...product.toObject(),
      images: product.images.map(addBaseUrl),
      thumbnail: addBaseUrl(product.thumbnail),
    }));

    res.status(200).json(productsWithFullUrls);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: 'Error fetching products, please try again later' });
  }
};

exports.getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const sortField = req.query.sort || 'createdAt';
    const sortOrder = req.query.order === 'asc' ? 1 : -1;

 
    const query = {};

    if (req.query.brand) {
      const brands = Array.isArray(req.query.brand) ? req.query.brand : [req.query.brand];
      query.brand = { $in: brands };
    }

    if (req.query.category) {
      const categories = Array.isArray(req.query.category) ? req.query.category : [req.query.category];
      query.category = { $in: categories };
    }

   
    if (req.query.includeDeleted !== 'true') {
      query.isDeleted = false;
    }

    const products = await Product.find(query)
      .populate("brand")
      .populate("category")
      .sort({ [sortField]: sortOrder }) 
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

   
    const productsWithFullUrls = products.map(product => ({
      ...product.toObject(),
      images: product.images.map(addBaseUrl),
      thumbnail: addBaseUrl(product.thumbnail),
    }));

    res.setHeader('X-Total-Count', total);
    res.status(200).json(productsWithFullUrls);

  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: 'Error fetching products, please try again later' });
  }
};
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id)
      .populate("brand")
      .populate("category");

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const productWithFullUrls = {
      ...product.toObject(),
      images: product.images.map(addBaseUrl),
      thumbnail: addBaseUrl(product.thumbnail),
    };

    res.status(200).json(productWithFullUrls);
  } catch (error) {
    console.error("Error getting product:", error);
    res.status(500).json({ message: 'Error getting product details, please try again later' });
  }
};

exports.updateById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFields = req.body;

    const images = req.files?.images?.map(file => file.path) || [];
    const thumbnail = req.files?.thumbnail?.[0]?.path || null;

    const stripBaseUrl = (url) => url?.replace('http://localhost:8000/', '');
    if (!thumbnail && updatedFields.thumbnail) {
      updatedFields.thumbnail = stripBaseUrl(updatedFields.thumbnail);
    } else if (thumbnail) {
      updatedFields.thumbnail = thumbnail;
    }
    let finalImages = [];

    if (updatedFields.existingImages) {
      try {
        const parsed = JSON.parse(updatedFields.existingImages);
        finalImages = parsed.map(stripBaseUrl);
      } catch (e) {
        console.error("Invalid existingImages format:", e);
      }
    }
    finalImages = finalImages.concat(images);
    updatedFields.images = finalImages;

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedFields, { new: true })
      .populate("brand")
      .populate("category");

    const baseUrl = 'http://localhost:8000/';
    const addBaseUrl = (url) => url?.startsWith('http') ? url : baseUrl + url;

    const updatedWithUrls = {
      ...updatedProduct.toObject(),
      images: updatedProduct.images.map(addBaseUrl),
      thumbnail: addBaseUrl(updatedProduct.thumbnail),
    };

    res.status(200).json(updatedWithUrls);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: 'Error updating product, please try again later' });
  }
};
exports.deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(deleted);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product, please try again later' });
  }
};

exports.undeleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const restored = await Product.findByIdAndUpdate(id, { isDeleted: false }, { new: true });
    res.status(200).json(restored);
  } catch (error) {
    res.status(500).json({ message: 'Error restoring product, please try again later' });
  }
};
