const { boolean } = require("joi");
const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  url: String,
  filename: String,
});

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  shortDesc: {
    type: String,
    required: true,
    maxLength: 45,
  },
  description: {
    type: String,
  },
  images: [ImageSchema],
  categories: {
    type: [String],
    required: true,
  },
  type: {
    type: String,
    required: true,
  },

  onPromo: {
    type: String,
    default: "false",
    enum: ["true", "false"],
  },
  promoPrice: {
    type: Number,
  },
  promoTime: {
    type: Date,
  },
  creatorData: {
    type: mongoose.Schema.Types.Mixed,
  },
  hidden: {
    type: Boolean,
  },
});

module.exports = mongoose.model("Product", ProductSchema);
