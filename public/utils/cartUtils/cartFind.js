// find in cart
const findInCart = async (id) => {
  //find an item in the cart by it's id
  let match = cart.products.filter((item) => {
    if (item.id == id) return true;
  });
  if (match.length > 0 && match[0]) {
    return match[0];
  } else {
    return false;
  }
};
