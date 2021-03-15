const express = require("express");
const router = express.Router();
const multer = require("multer");
const sharp = require("sharp");
const uploads = multer({ storage: multer.memoryStorage() });
const products = require("../controllers/products");
const { isAdmin } = require("../public/utils/middleware");

const resizeImages = async (req, res, next) => {
  if (!req.files) return next();
  req.body.images = [];
  await Promise.all(
    req.files.map(async (file) => {
      const newFilename = file.originalname;
      await sharp(file.buffer).resize(350, 350).toFormat("jpeg").jpeg({ quality: 90 }).toFile(`public/uploads/thumbnails/${newFilename}`);
      await sharp(file.buffer).resize(800, 800).toFormat("jpeg").jpeg({ quality: 100 }).toFile(`public/uploads/regulars/${newFilename}`);
      req.body.images.push(newFilename);
    })
  );
  next();
};

router
  .route("/kwiaty")
  // show all products
  .get(products.productsAll)
  // create new product
  .post(isAdmin, uploads.array("image"), resizeImages, products.createProduct);

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
  .put(isAdmin, uploads.array("image"), resizeImages, products.editProduct);

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
