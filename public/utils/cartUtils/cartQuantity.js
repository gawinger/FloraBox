// add quantity of product
const addQuantity = (id, qty = 1) => {
  cart.products = cart.products.map((item) => {
    if (item.id === id) item.qty += qty;
    return item;
  });
  updateCart();
};

// reduce quantity of product
// check if quantity is equal to 0, if so remove product from cart
const reduceQuantity = (id, qty = 1) => {
  cart.products = cart.products.map((item) => {
    if (item.id === id) item.qty = item.qty - qty;
    return item;
  });
  cart.products.forEach(async (item) => {
    if (item.id === id && item.qty === 0) await removeFromCart(id);
  });
  updateCart();
};
