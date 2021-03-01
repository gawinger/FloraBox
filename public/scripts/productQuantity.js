const add = document.querySelector(".qty-add");
const sub = document.querySelector(".qty-sub");


const changeValue = function (e, value) {
  e.value += parseInt(value);
};

// on click add 1 to quantity of displayed item
add.addEventListener("click", (e) => {
  const qty = document.querySelector("#quantity");
  const quantity = parseInt(qty.value) + 1;
  qty.value = quantity;
});

// on click substract 1 to quantity of displayed item
sub.addEventListener("click", (e) => {
  const qty = document.querySelector("#quantity");
  const quantity = parseInt(qty.value) - 1;
  if (!quantity < 1) {
    qty.value = quantity;
  }
});
