// cart functionality file

// change products num and sum to 0
let productsNum = 0;
let productsSum = 0;

// if cart is not hidden and
// if user clicks on cart or cart button hide cart
const closeCart = (e) => {
  if (!showCart.contains(e.target) && e.target !== cartBtn) {
    showCart.classList.add("hidden");
    window.removeEventListener("click", closeNav);
  }
};

// on click on cart button toggle hidden class
const toggleCart = () => {
  showCart.classList.toggle("hidden");
  window.addEventListener("click", closeCart);
};

// create cart variable with key value and add it to local storage
const cart = {
  key: "TFzG6+W_wFC3&tTx",
  products: [],
  init() {
    let _products = localStorage.getItem(cart.key);
    if (_products) cart.products = JSON.parse(_products);
  },
};

// on dom loaded initialize cart
document.addEventListener("DOMContentLoaded", () => {
  //get the cart products from localStorage
  cart.init();
  const addBtn = document.querySelector(".add-to-cart");
  if (addBtn) {
    addBtn.addEventListener("click", async (e) => {
      const product = JSON.parse(document.querySelector("#variableJSON").innerHTML);
      await addToCart(product, product._id);
    });
  }
  updateCart();
});

const cartItems = document.querySelector(".cart-items");
const showCart = document.querySelector(".cart-show");
const cartBtn = document.querySelector(".cart-button");
const cartAmount = document.querySelector(".cart-products-num");
const cartValue = document.querySelector(".cart-value");
const cartMobile = document.querySelector(".cart-mobile");
const cartMobileAmount = document.querySelector(".cart-mobile-num");
const cartEmpty = document.querySelector(".cart-empty-msg");
