const express = require("express");
const Product = require("../models/product");
const router = express.Router();
const fs = require("fs");
const { pagination, getProductNum } = require("../public/utils/pagination");

// Show home page
router.get("/", async (req, res) => {
  const productsAmount = await getProductNum(Product.find({ type: { $ne: "creation" } }), res.locals.currentUser, req.query.limit);
  const products = await pagination(Product.find({ type: { $ne: "creation" } }), req.query.p, req.query.limit);
  console.log(productsAmount);
  res.render("index", { products, productsAmount });
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
  const { id, photoId } = req.params;
  const product = await Product.findById(id);
  fs.unlinkSync("./public/photos/" + req.body.deletedImg);
  await product.updateOne({ $pull: { images: { _id: { $in: photoId } } } }, { new: true });
  await product.save();
  req.flash("success", "Pomyślnie usunięto zdjęcie produktu");
  res.redirect(`/kwiaty/edytuj/${id}`);
});

router.get("/zamowienia", async (req, res) => {
  res.render("orders");
});
module.exports = router;
