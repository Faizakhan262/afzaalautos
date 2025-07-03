const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discountPercentage: { type: Number, required: true },
    stockQuantity: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    thumbnail: { type: String },
    images: [{ type: String }],
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true 
  }
);

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
