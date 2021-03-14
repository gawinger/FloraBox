const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const uploads = multer({ storage });
const products = require("../controllers/products");
const { isAdmin } = require("../public/utils/middleware");

router
  .route("/kwiaty")
  // show all products
  .get(products.productsAll)
  // create new product
  .post(isAdmin, uploads.array("image"), products.createProduct);

router
  .route("/kwiaty/okazje")
  // show all occasions
  .get(products.occasionsAll);

router
  .route("/kwiaty/okazje/:category")
  // show products for occasion
  .get(products.occasion);

router
  .route("/kwiaty/kategorie/:type")
  // show products with category
  .get(products.category);

router
  .route("/kwiaty/promocje")
  // show products on sale
  .get(products.sale);

router
  .route("/kwiaty/nowy")
  // render form to create new product
  .get(isAdmin, products.createForm);

router
  .route("/kwiaty/:id")
  // show product with provided id
  .get(products.showProduct)
  // delete product
  .delete(isAdmin, products.deleteProduct);

router
  .route("/kwiaty/edytuj/:id")
  // render form to edit product
  .get(isAdmin, products.editForm)
  // edit product
  .put(isAdmin, uploads.array("image"), products.editProduct);

router
  .route("/kwiaty/widocznosc/:id")
  // change product visibility
  .put(isAdmin, products.editVisibility);

router
  .route("/kreator")
  // show bouquet creations
  .get(products.creators);

router
  .route("/wience")
  // show all wreaths
  .get(products.allWreaths);

router
  .route("/pogrzeb")
  // show funeral products
  .get(products.funeral);

router
  .route("/pogrzeb/wience")
  // show wreaths
  .get(products.wreaths);

router
  .route("/pogrzeb/wience-sztuczne")
  // show wreaths
  .get(products.artificialWreaths);

module.exports = router;
