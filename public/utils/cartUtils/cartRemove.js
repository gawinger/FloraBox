// remove product with provided id from cart
const removeFromCart = (id) => {
  cart.products = cart.products.filter((item) => {
    if (item.id !== id) {
      return true;
    }
  });
  updateCart();
};
