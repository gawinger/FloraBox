const select = document.querySelector("select");
const categoriesSelection = document.querySelector(".categories");
const form = document.querySelector("form");
const promotion = document.querySelector("#promotion");
const regular = document.querySelector("#no-promotion");
const promotionDetails = document.querySelector(".prom-details");
const creator = document.querySelector(".creator");
const creatorData = document.querySelector(".creator-data");
const createCategoryBtn = document.querySelector(".creator-add");
const creatorOptions = document.querySelector(".creator-options");
const categoryAmount = document.querySelector("#categoryAmount");
const AddOptionBtn = document.querySelector(".add-option-btn");

createCategoryBtn.addEventListener("click", (e) => {
  e.preventDefault();
  createCategory();
});

AddOptionBtn.addEventListener("click", (e) => {
  e.preventDefault();
  createOption(e.target.parentElement);
});

// on adding creator set values to 1
let creatorAmount = 1;
let categoryNum = 1;

const createCategory = () => {
  // on new category creation add increase category amount and number of category
  categoryAmount.value = parseInt(categoryAmount.value) + 1;
  categoryNum++;
  // create div and set its innerHTMl to divs containing data about category
  let div = document.createElement("div");
  div.classList.add("creator-create");
  div.innerHTML = `
        <div class="creator-name">
          <label for="creator-category-name">Nazwa kategorii</label>
          <input type="text" name="creatorCategory${categoryNum}" id="option-name" />
        </div>
        <div class="creator-options" data-optionamount="1">
          <div class="creator-option">
            <label for="option-name">Opcja #1</label>
            <input type="text" name="creator${categoryNum}Option1" id="option-name" />
            <label for="option-price">Cena</label>
            <input type="text" name="creator${categoryNum}Option1Change" id="option-price" />
          </div>
        </div>
  `;
  // create button with function of creating option to category
  // append option as child into category
  let btn = document.createElement("div");
  btn.classList.add("add-option");
  btn.innerHTML = `<button class="add-option-btn">Dodaj opcję</button>`;
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    createOption(e.target.parentElement);
  });
  creatorData.appendChild(div);
  const btnParent = div.querySelector(".creator-options");
  btnParent.appendChild(btn);
  div.dataset.categorynum = categoryNum;
};

const createOption = (e) => {
  // create div with option data, icrease option amount by 1
  let div = document.createElement("div");
  div.classList.add("creator-option");
  e.parentElement.insertBefore(div, e);
  div.parentElement.dataset.optionamount++;
  const optionAmount = div.parentElement.dataset.optionamount;
  const categoryNum = div.parentElement.parentElement.dataset.categorynum;
  div.innerHTML = `
  <label for="option-name">Opcja #${optionAmount}</label>
  <input type="text" name="creator${categoryNum}Option${optionAmount}" id="option-name" />
  <label for="option-price">Cena</label>
  <input type="number" step=".01" name="creator${categoryNum}Option${optionAmount}Change" id="option-price" />
  `;
};

// remove hidden classList from promotionDetails
promotion.addEventListener("change", () => {
  promotionDetails.classList.remove("hidden");
});

// hide promotion details
regular.addEventListener("change", () => {
  promotionDetails.classList.add("hidden");
});

select.addEventListener("change", () => {
  if (select.value === "creation") {
    categoriesSelection.classList.add("hidden");
    creator.classList.remove("hidden");
  } else {
    categoriesSelection.classList.remove("hidden");
    creator.classList.add("hidden");
  }
});
