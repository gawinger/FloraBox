const express = require('express');
const Product = require('../models/product')
const router = express.Router();


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

module.exports = router;
