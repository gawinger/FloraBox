// Product edit form funcionality
// Check product's type value and set it in the form
const optionsContainer = document.querySelector("select");
const options = document.querySelectorAll("select option");

options.forEach((option) => {
  option.value === optionsContainer.dataset.option ? (option.selected = true) : (option.selected = false);
});

// Check product's categories and set them as checked
const categoriesContainer = document.querySelector(".categories");
const categories = document.querySelectorAll(".categories input");

const productCats = categoriesContainer.dataset.categories;
categories.forEach((cat) => {
  productCats.includes(cat.value) ? (cat.checked = true) : (cat.checked = false);
});

// Check product's promo value
const promotionContainer = document.querySelector(".promotion");
const promotionStatus = document.querySelectorAll(".promotion-select input");
const promoPrice = document.querySelector("#promo-price");
const promoDuration = document.querySelector("#promo-duration");

if (select.value === "creation") {
  categoriesSelection.classList.add("hidden");
  creator.classList.remove("hidden");
} else {
  categoriesSelection.classList.remove("hidden");
  creator.classList.add("hidden");
}

const { promo, promoprice, promotime } = promotionContainer.dataset;

promoPrice.value = parseFloat(promoprice);
promoDuration.value = promotime;

if (promo === "true ") {
  promotionStatus[0].checked = true;
  const event = new Event("change");
  promotionStatus[0].dispatchEvent(event);
} else {
  promotionStatus[1].checked = true;
}
