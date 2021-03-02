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
