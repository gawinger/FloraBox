const Product = require("../../models/product");

// check if user is authenticated
module.exports.isLogged = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be logged in to do this");
    return res.redirect("/logowanie");
  }
  next();
};

// check if user is not authenticated
module.exports.isNotLogged = (req, res, next) => {
  if (req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    return res.redirect("/");
  }
  next();
};

// check if user is admin
module.exports.isAdmin = (req, res, next) => {
  if (!res.locals.currentUser || res.locals.currentUser.role !== "admin") {
    req.flash("error", "You do not have permoission to do it");
    return res.redirect("/");
  }
  next();
};

// check if product promotion date did expire
// if so then change its onPromo value to false and remove promoTime and promoPrice values
module.exports.checkPromotion = async (req, res, next) => {
  const products = await Product.find({ onPromo: "true" });
  products.forEach(async (product) => {
    let timeLeft = Date.parse(product.promoTime) - Date.parse(new Date());
    if (timeLeft <= 0) {
      product.onPromo = "false";
      product.promoTime = "";
      product.promoPrice = "";
      await product.save();
    }
  });
};

// function that runs another function every full hour
module.exports.runEveryFullHours = (callbackFn) => {
  const Hour = 60 * 60 * 1000;
  const currentDate = new Date();
  const firstCall = Hour - (currentDate.getMinutes() * 60 + currentDate.getSeconds()) * 1000 + currentDate.getMilliseconds();
  setTimeout(() => {
    callbackFn();
    setInterval(callbackFn, Hour);
  }, firstCall);
};
