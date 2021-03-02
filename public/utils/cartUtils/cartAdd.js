// add to cart
const addToCart = async (product, id) => {
  // set default qty ass 1 and then replace it with actual qty value
  let qty = 1;
  if (document.querySelector("#quantity")) {
    qty = parseInt(document.querySelector("#quantity").value);
  }
  // if product type is 'creation' then render information about it differently
  // istead of product description render picked by user options
  if (product.type === "creation") {
    product.price = parseInt(document.querySelector(".product-price").innerText);
    let creatorData = [];
    document.querySelectorAll("select").forEach((e) => {
      creatorDataPair = [e.name, e.options[e.selectedIndex].innerText, "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp"];
      creatorDataPair = creatorDataPair.join(",").replace(",", ": ").replace(",", "");
      creatorData.push(creatorDataPair);
    });
    product.shortDesc = creatorData.join(",").replaceAll(",", "");
    removeFromCart(id);
  }
  // if cart already contains added products, not with creation type, add quantity
  if ((await findInCart(id)) && product.type !== "creation") {
    addQuantity(id, qty);
  } else {
    // else create new product object with data from local storage and push them into cart
    const { images, name, price, type, description, shortDesc, onPromo, promoPrice, promoTime } = product;
    let obj = {
      id: product._id,
      name,
      price,
      image: images[0],
      type,
      qty,
      description,
      onPromo,
      promoPrice,
      promoTime,
      shortDesc,
    };

    cart.products.push(obj);
    //update localStorage
    updateCart();
  }
};
