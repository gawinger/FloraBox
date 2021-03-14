const Product = require("../models/product");
const fs = require("fs");

// function for product search functionality
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

const limit = 12;

// Get amount of products
async function getProductNum(collection, user) {
  let productsAmount = (await collection.countDocuments({})) - (await collection.countDocuments({ hidden: true }));
  if (user && user.role === "admin") {
    productsAmount = await collection.countDocuments({});
  }
  return productsAmount / limit;
}

// Pagination functionality
async function pagination(collection, p) {
  let page = 1;
  if (p) page = parseInt(p);
  const skip = (page - 1) * limit;
  return await collection.skip(skip).limit(limit);
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
    const productsAmount = await getProductNum(Product.find({}), res.locals.currentUser);
    const products = await pagination(Product.find({}), req.query.p);
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
  const productsAmount = await getProductNum(Product.find({}), res.locals.currentUser);
  const products = await pagination(Product.find({}), req.query.p);
  res.render("occasions", { products, productsAmount });
};

// show prodcuts for occasion
module.exports.occasion = async (req, res) => {
  const { category } = req.params;
  const productsAmount = await getProductNum(Product.find({ categories: { $in: [category] } }), res.locals.currentUser);
  const products = await pagination(Product.find({ categories: { $in: [category] } }), req.query.p);
  res.render("products", { products, productsAmount });
};

// show prodcuts with category
module.exports.category = async (req, res) => {
  const { type } = req.params;
  const productsAmount = await getProductNum(Product.find({ type: type }), res.locals.currentUser);
  const products = await pagination(Product.find({ type: type }), req.query.p);
  res.render("products", { products, productsAmount });
};

// show prodcuts on sale
module.exports.sale = async (req, res) => {
  const productsAmount = await getProductNum(Product.find({ onPromo: true }), res.locals.currentUser);
  const products = await pagination(Product.find({ onPromo: true }), req.query.p);
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
  const productsAmount = await getProductNum(Product.find({ type: "creation" }), res.locals.currentUser);
  const products = await pagination(Product.find({ type: "creation" }), req.query.p);
  res.render("products", { products, productsAmount });
};

// show all wreaths
module.exports.allWreaths = async (req, res) => {
  const productsAmount = await getProductNum(Product.find({ type: ["wience", "sztuczne-wience"] }), res.locals.currentUser);
  const products = await pagination(Product.find({ type: ["wience", "sztuczne-wience"] }), req.query.p);
  res.render("wreaths", { products, productsAmount });
};

// show funeral
module.exports.funeral = async (req, res) => {
  const productsAmount = await getProductNum(Product.find({ categories: { $in: "pogrzeb" } }), res.locals.currentUser);
  const products = await pagination(Product.find({ categories: { $in: "pogrzeb" } }), req.query.p);
  res.render("products", { products, productsAmount });
};

// show wreaths
module.exports.wreaths = async (req, res) => {
  const productsAmount = await getProductNum(Product.find({ type: "wience" }), res.locals.currentUser);
  const products = await pagination(Product.find({ type: "wience" }), req.query.p);
  res.render("products", { products, productsAmount });
};

// show wreaths
module.exports.artificialWreaths = async (req, res) => {
  const productsAmount = await getProductNum(Product.find({ type: "sztuczne-wience" }), res.locals.currentUser);
  const products = await pagination(Product.find({ type: "sztuczne-wience" }), req.query.p);
  res.render("products", { products, productsAmount });
};
