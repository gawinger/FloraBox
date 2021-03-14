const Product = require("../models/product");
const fs = require("fs");

// function for product search functionality
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

// show all product
module.exports.productsAll = async (req, res) => {
  if (req.query.q) {
    const regex = new RegExp(escapeRegex(req.query.q), "gi");
    Product.find({ name: regex }, function (err, foundproducts) {
      if (err) {
        req.flash("false", `Brak wyników dla podanego wyszukiwania`);
        res.render("products");
      } else {
        res.render("products", { products: foundproducts });
      }
    });
  } else {
    const products = await Product.find({});
    res.render("products", { products });
  }
};

// create new product
module.exports.createProduct = async (req, res) => {
  const product = new Product(req.body);
  // if type of product is creation, noOccasion or funeral then add it as products category
  if (product.categories.includes("bez-okazji")) product.categories = ["bez-okazji"];
  if (product.categories.includes("pogrzeb")) product.categories = ["pogrzeb"];
  if (req.body.type === "creation") {
    product.categories = ["kreator bukietów"];
    const creatorData = [];
    // into creator data push object with category name and options
    for (let i = 1; i <= req.body.creatorAmount; i++) {
      const keys = Object.keys(req.body);
      const optionAmount = keys.filter((key) => key.includes(`creator${i}Option`)).length / 2;
      const optionData = {};
      // add category name to optionData object
      optionData.categoryName = req.body[`creatorCategory${i}`];
      // iterate throught all options and add them to optionData object
      for (let j = 1; j <= optionAmount; j++) {
        // if priceChange value is not provided set it to 0
        if (req.body[`creator${i}Option${j}Change`] === "") {
          req.body[`creator${i}Option${j}Change`] = 0;
        }
        optionData["option" + j] = {
          optionName: req.body[`creator${i}Option${j}`],
          priceChange: req.body[`creator${i}Option${j}Change`],
        };
      }
      // push option data into creator data
      creatorData.push(optionData);
    }
    product.creatorData = creatorData;
  }
  // if user is trying to add more than 5 files flash error
  if (req.files.length > 5) {
    req.flash("error", "Produkt może mieć maksymalnie 4 zdjęcia");
    return red.redirect(`/kwiaty/edytuj/${product.id}`);
  }
  // map through provided files and check if files length is lower than 5
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  if (imgs.length + product.images.length >= 5) {
    req.flash("error", "Produkt może mieć maksymalnie 4 zdjęcia");
    return res.redirect(`/kwiaty/edytuj/${product.id}`);
  }
  // push images into product object
  product.images.push(...imgs);
  product.hidden = true;
  await product.save();
  res.redirect(`kwiaty/${product.id}`);
};

// show all occasions
module.exports.occasionsAll = async (req, res) => {
  const products = await Product.find({});
  res.render("occasions", { products });
};

// show prodcuts for occasion
module.exports.occasion = async (req, res) => {
  const { category } = req.params;
  const products = await Product.find({ categories: { $in: [category] } });
  res.render("products", { products });
};

// show prodcuts with category
module.exports.category = async (req, res) => {
  const { type } = req.params;
  const products = await Product.find({ type: type });
  res.render("products", { products });
};

// show prodcuts on sale
module.exports.sale = async (req, res) => {
  const products = await Product.find({ onPromo: true });
  res.render("products", { products });
};

// render form to create new product
module.exports.createForm = (req, res) => {
  res.render("new-product");
};

// show product with provided id
module.exports.showProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (product.type === "creation") {
    res.render("products-creator", { product });
  } else {
    res.render("products-product", { product });
  }
};

// delete product
module.exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  product.images.forEach((e) => {
    fs.unlinkSync("./public/photos/" + e.filename);
  });
  req.flash("success", "Produkt został usunięty");
  res.redirect("/kwiaty");
};

// render form to edit product
module.exports.editForm = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render("edit-product", { product });
};

// edit product
module.exports.editProduct = async (req, res) => {
  const { id } = req.params;
  // if type of product is creation, noOccasion or funeral then add it as products category
  if (product.categories.includes("bez-okazji")) product.categories = ["bez-okazji"];
  if (product.categories.includes("pogrzeb")) product.categories = ["pogrzeb"];
  if (req.body.type === "creation") {
    product.categories = ["kreator bukietów"];
    const creatorData = [];
    // into creator data push object with category name and options
    for (let i = 1; i <= req.body.creatorAmount; i++) {
      creatorData.push({
        categoryName: req.body[`creatorCategory${i}`],
        option1: {
          optionName: req.body[`creator${i}Option1`],
          priceChange: req.body[`creator${i}Option1Change`],
        },
        option2: {
          optionName: req.body[`creator${i}Option2`],
          priceChange: req.body[`creator${i}Option2Change`],
        },
        option3: {
          optionName: req.body[`creator${i}Option3`],
          priceChange: req.body[`creator${i}Option3Change`],
        },
        option4: {
          optionName: req.body[`creator${i}Option4`],
          priceChange: req.body[`creator${i}Option4Change`],
        },
        option5: {
          optionName: req.body[`creator${i}Option5`],
          priceChange: req.body[`creator${i}Option5Change`],
        },
      });
    }
    product.creatorData = creatorData;
  }
  const product = await Product.findByIdAndUpdate(id, { ...req.body });
  // map through provided files and check if files length is lower than 5
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  if (imgs.length + product.images.length >= 5) {
    req.flash("error", "Produkt może mieć maksymalnie 4 zdjęć");
    return res.redirect(`/kwiaty/edytuj/${product.id}`);
  } else {
    // push images into product object
    product.images.push(...imgs);
    product.hidden = true;
    await product.save();
    if (product.type === "creation") {
      res.redirect(`/kreator/${product.id}`);
    } else {
      res.redirect(`/kwiaty/${product.id}`);
    }
  }
};

// change visibility of products
module.exports.editVisibility = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  req.body.visibility === "hidden" ? (product.hidden = true) : (product.hidden = false);
  await product.save();
  res.redirect(`/kwiaty/${product.id}`);
};

// show bouquet creations
module.exports.creators = async (req, res) => {
  const products = await Product.find({ type: "creation" });
  res.render("products", { products });
};

// show all wreaths
module.exports.allWreaths = async (req, res) => {
  const products = await Product.find({ type: ["wience", "sztuczne-wience"] });
  res.render("wreaths", { products });
};

// show funeral
module.exports.funeral = async (req, res) => {
  const products = await Product.find({ categories: { $in: "pogrzeb" } });
  res.render("products", { products });
};

// show wreaths
module.exports.wreaths = async (req, res) => {
  const products = await Product.find({ type: "wience" });
  res.render("products", { products });
};

// show wreaths
module.exports.artificialWreaths = async (req, res) => {
  const products = await Product.find({ type: "sztuczne-wience" });
  res.render("products", { products });
};
