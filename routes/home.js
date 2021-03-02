const express = require("express");
const Product = require("../models/product");
const router = express.Router();
const fs = require("fs");

// Show home page
router.get("/", async (req, res) => {
  const products = await Product.find({ type: { $ne: "creation" } });
  res.render("index", { products });
});

// Show cart page
router.get("/koszyk", async (req, res) => {
  const url = req.url;
  res.render("cart", { url });
});

// Show contact page
router.get("/kontakt", (req, res) => {
  res.render("contact");
});

// Delete product image
router.delete("/kwiaty/:id/photos/:photoId", async (req, res) => {
  console.log("working");
  console.log(req.body);
  const { id, photoId } = req.params;
  const product = await Product.findById(id);
  fs.unlinkSync("./public/photos/" + req.body.deletedImg);
  await product.updateOne({ $pull: { images: { _id: { $in: photoId } } } }, { new: true });
  await product.save();
  req.flash("success", "Pomyślnie usunięto zdjęcie produktu");
  res.redirect(`/kwiaty/edytuj/${id}`);
});

module.exports = router;
