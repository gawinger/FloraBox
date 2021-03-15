const Product = require("../models/product");
const fs = require("fs");
const { pagination, getProductNum } = require("../public/utils/pagination");
const { createCreator } = require("../public/utils/createCreator");
const sharp = require("sharp");

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
    const productsAmount = await getProductNum(Product.find({}), res.locals.currentUser, req.query.limit);
    const products = await pagination(Product.find({}), req.query.p, req.query.limit);
    res.render("products", { products, productsAmount });
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
    product.creatorData = await createCreator(req.body);
  }
  // if user is trying to add more than 5 files flash error
  if (req.body.images.length > 5 || req.body.images.length + product.images.length >= 5) {
    req.flash("error", "Produkt może mieć maksymalnie 4 zdjęcia");
    return res.redirect(`/kwiaty/edytuj/${product.id}`);
  }
  product.hidden = true;
  await product.save();
  res.redirect(`kwiaty/${product.id}`);
};

// show all occasions
module.exports.occasionsAll = async (req, res) => {
  const productsAmount = await getProductNum(Product.find({}), res.locals.currentUser, req.query.limit);
  const products = await pagination(Product.find({}), req.query.p, req.query.limit);
  res.render("occasions", { products, productsAmount });
};

// show prodcuts for occasion
module.exports.occasion = async (req, res) => {
  const { category } = req.params;
  const productsAmount = await getProductNum(Product.find({ categories: { $in: [category] } }), res.locals.currentUser, req.query.limit);
  const products = await pagination(Product.find({ categories: { $in: [category] } }), req.query.p, req.query.limit);
  res.render("products", { products, productsAmount });
};

// show prodcuts with category
module.exports.category = async (req, res) => {
  const { type } = req.params;
  const productsAmount = await getProductNum(Product.find({ type: type }), res.locals.currentUser, req.query.limit);
  const products = await pagination(Product.find({ type: type }), req.query.p, req.query.limit);
  res.render("products", { products, productsAmount });
};

// show prodcuts on sale
module.exports.sale = async (req, res) => {
  const productsAmount = await getProductNum(Product.find({ onPromo: true }), res.locals.currentUser, req.query.limit);
  const products = await pagination(Product.find({ onPromo: true }), req.query.p, req.query.limit);
  res.render("products", { products, productsAmount });
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
    fs.unlinkSync("./public/uploads/regulars/" + e);
    fs.unlinkSync("./public/uploads/thumbnails/" + e);
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
  const oldProduct = await Product.findById(id);
  const oldImages = oldProduct.images;
  const product = await Product.findByIdAndUpdate(id, { ...req.body });
  req.body.images.forEach((img) => product.images.unshift(img));
  // if type of product is creation, noOccasion or funeral then add it as products category
  if (product.categories.includes("bez-okazji")) product.categories = ["bez-okazji"];
  if (product.categories.includes("pogrzeb")) product.categories = ["pogrzeb"];
  if (req.body.type === "creation") {
    const creatorData = createCreator(req.body);
    product.categories = ["kreator bukietów"];
    product.creatorData = creatorData;
  }
  // map through provided files and check if files length is lower than 5
  if (req.body.images.length > 5 || req.body.images.length + oldImages.length >= 5) {
    req.flash("error", "Produkt może mieć maksymalnie 4 zdjęcia");
    return res.redirect(`/kwiaty/edytuj/${product.id}`);
  } else {
    // push images into product object
    product.hidden = true;
    await product.save();
    res.redirect(`/kwiaty/${product.id}`);
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
  const productsAmount = await getProductNum(Product.find({ type: "creation" }), res.locals.currentUser, req.query.limit);
  const products = await pagination(Product.find({ type: "creation" }), req.query.p, req.query.limit);
  res.render("products", { products, productsAmount });
};

// show all wreaths
module.exports.allWreaths = async (req, res) => {
  const productsAmount = await getProductNum(Product.find({ type: ["wience", "sztuczne-wience"] }), res.locals.currentUser, req.query.limit);
  const products = await pagination(Product.find({ type: ["wience", "sztuczne-wience"] }), req.query.p, req.query.limit);
  res.render("wreaths", { products, productsAmount });
};

// show funeral
module.exports.funeral = async (req, res) => {
  const productsAmount = await getProductNum(Product.find({ categories: { $in: "pogrzeb" } }), res.locals.currentUser, req.query.limit);
  const products = await pagination(Product.find({ categories: { $in: "pogrzeb" } }), req.query.p, req.query.limit);
  res.render("products", { products, productsAmount });
};

// show wreaths
module.exports.wreaths = async (req, res) => {
  const productsAmount = await getProductNum(Product.find({ type: "wience" }), res.locals.currentUser, req.query.limit);
  const products = await pagination(Product.find({ type: "wience" }), req.query.p, req.query.limit);
  res.render("products", { products, productsAmount });
};

// show wreaths
module.exports.artificialWreaths = async (req, res) => {
  const productsAmount = await getProductNum(Product.find({ type: "sztuczne-wience" }), res.locals.currentUser, req.query.limit);
  const products = await pagination(Product.find({ type: "sztuczne-wience" }), req.query.p, req.query.limit);
  res.render("products", { products, productsAmount });
};
