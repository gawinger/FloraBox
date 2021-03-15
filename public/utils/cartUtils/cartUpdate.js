// Update cart
const updateCart = async () => {
  let _cart = JSON.stringify(cart.products);
  await localStorage.setItem(cart.key, _cart);
  // remove all items from cart
  cartItems.innerHTML = "";
  productsNum = 0;
  productsSum = 0;

  // if cart is empty set cartValue to 0 and display message
  if (cart.products.length === 0 && cartValue) {
    cartValue.innerHTML = `0.00 zł`;
    cartItems.innerHTML = "Twój koszyk jest pusty";
  }

  // for every product in local storage increse number of products and price of them
  // display those values in cart and create div for each product with its data
  cart.products.forEach(({ qty, price, promoPrice, currentPrice, image, name, id, shortDesc, onPromo }) => {
    productsNum += qty;
    // if product is on promo change product sum value
    onPromo === "true" ? (productsSum += promoPrice * qty) : (productsSum += price * qty);

    let cartItem = "";
    // check if cartValue exist
    // if yes then set cart price to new value
    // check if product is on promo
    if (cartValue) cartValue.innerHTML = `${productsSum.toFixed(2)}zł`;
    if (onPromo === "true") {
      currentPrice = promoPrice;
    } else {
      currentPrice = price;
    }

    console.log(image);
    cartItem = `
        <div class="cart-item" data-id="${id}">
          <a href="/kwiaty/${id}"><div class="item-img"><img src="/uploads/thumbnails/${image}"/></div></a>
          <div class="item-data">
          <a href="/kwiaty/${id}"><div class="item-name">${name}</div></a>
            <div class="item-description">${shortDesc}</div>
            <div class="item-price"><span class="qty">${qty}</span> x <span class="price">${currentPrice.toFixed(2)}</span>zł</div> 
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
    // if number of products is greater than 0 show cart otherwise hide it
    if (productsNum > 0) {
      cartAmount.classList.remove("hidden");
      cartEmpty.classList.add("hidden");
    } else {
      cartAmount.classList.add("hidden");
      cartEmpty.classList.remove("hidden");
    }
    cartBtn.addEventListener("click", toggleCart);
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
