const salePrice = document.querySelector(".product-price-new");
const price = document.querySelector(".product-price");
const initialPrice = price.innerHTML;
const selects = document.querySelectorAll("select");
let priceChange = 0;
let selectValues = [];

// on creator page check what options are selected and change overall price
// and data about creator to data connected with checked options
selects.forEach((e) => {
  selectValues.push(parseInt(e.options[e.selectedIndex].attributes[1].value));
  priceChange = selectValues.reduce(function (acc, currVal) {
    return acc + currVal;
  });
  newPrice = parseInt(initialPrice) + priceChange;
  price.innerHTML = `${newPrice}zł`;
  e.addEventListener("change", () => {
    selectValues = [];
    selects.forEach((e) => {
      selectValues.push(parseInt(e.options[e.selectedIndex].attributes[1].value));
      priceChange = selectValues.reduce(function (acc, currVal) {
        return acc + currVal;
      });
    });
    newPrice = parseInt(initialPrice) + priceChange;
    price.innerHTML = `${newPrice}zł`;
  });
});
