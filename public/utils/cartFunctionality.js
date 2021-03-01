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

// Update cart
const updateCart = async () => {
  let _cart = JSON.stringify(cart.products);
  await localStorage.setItem(cart.key, _cart);
  // remove all items from cart
  cartItems.innerHTML = "";
  productsNum = 0;
  productsSum = 0;
  // for every product in local storage increse number of products and price of them
  // display those values in cart and create div for each product with its data
  cart.products.forEach((product) => {
    productsNum += product.qty;
    if (product.onPromo === "true") {
      productsSum += product.promoPrice * product.qty;
    } else {
      productsSum += product.price * product.qty;
    }
    let cartItem = "";
    if (cartValue) cartValue.innerHTML = `${productsSum.toFixed(2)}zł`;
    if (product.onPromo === "true") {
      product.currentPrice = product.promoPrice;
    } else {
      product.currentPrice = product.price;
    }

    cartItem = `
      <div class="cart-item" data-id="${product.id}">
        <a href="/kwiaty/${product.id}"><div class="item-img"><img src="/photos/${product.image.filename}"/></div></a>
        <div class="item-data">
        <a href="/kwiaty/${product.id}"><div class="item-name">${product.name}</div></a>
          <div class="item-description">${product.shortDesc}</div>
          <div class="item-price"><span class="qty">${product.qty}</span> x <span class="price">${product.currentPrice.toFixed(2)}</span>zł</div> 
          </div>
        <div class="item-remove"><i class="far fa-trash-alt"></i></div>
      </div>`;

    cartItems.insertAdjacentHTML("beforeend", cartItem);
  });
  // if there are no products then remove productsNum value
  if (productsNum === 0) {
    productsNum = "";
  }

  // if there is cartBtn in document update values for every data containing element in cart
  if (cartBtn) {
    document.querySelector(".cart-products-num").innerHTML = `${productsNum}`;
    document.querySelector(".cart-total").innerHTML = `${productsSum.toFixed(2)}zł`;
    document.querySelector(".sum-value").innerHTML = `${productsSum.toFixed(2)}zł`;
    document.querySelectorAll(".item-remove").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const id = await e.target.parentElement.parentElement.dataset.id;
        await removeFromCart(id);
        await e.target.parentElement.remove();
      });
    });
    // if number of products is greater than 0 show cart else hide it
    if (productsNum > 0) {
      cartBtn.addEventListener("click", toggleCart);
      cartAmount.classList.remove("hidden");
    } else {
      cartBtn.removeEventListener("click", toggleCart);
      showCart.classList.add("hidden");
      cartAmount.classList.add("hidden");
    }
  }

  // if user is on 'koszyk' page then add remove button functionality to new buttons
  if (location.pathname === "/koszyk") {
    const removeBtns = document.querySelectorAll(".item-remove");
    removeBtns.forEach((e) => {
      e.addEventListener("click", () => {
        removeFromCart(e.parentElement.dataset.id);
      });
    });
  }
};

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

// add quantity of product
const addQuantity = (id, qty = 1) => {
  cart.products = cart.products.map((item) => {
    if (item.id === id) {
      item.qty += qty;
    }
    return item;
  });
  updateCart();
};

// reduce quantity of product
// check if quantity is equal to 0, if so remove product from cart
const reduceQuantity = (id, qty = 1) => {
  cart.products = cart.products.map((item) => {
    if (item.id === id) {
      item.qty = item.qty - qty;
    }
    return item;
  });
  cart.products.forEach(async (item) => {
    if (item.id === id && item.qty === 0) await removeFromCart(id);
  });
  updateCart();
};

// remove product with provided id from cart
const removeFromCart = (id) => {
  cart.products = cart.products.filter((item) => {
    if (item.id !== id) {
      return true;
    }
  });
  updateCart();
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
