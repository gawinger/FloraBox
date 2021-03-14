let currentPage;
// if there are pages change style of current page Number
if (document.querySelector(".product-page")) {
  currentPage = document.querySelector(`.product-page .page-1`);
}
if (window.location.search && window.location.search.toString().includes("p=")) {
  const currentPageNum = window.location.search.toString().substring(3);
  currentPage = document.querySelector(`.product-page .page-${currentPageNum}`);
}
if (currentPage) {
  currentPage.classList.add("current-page");
}

let limit = document.querySelector("#displayAmount");
let limitOptions = document.querySelectorAll("#displayAmount option");

let limitValue;
limitOptions.forEach((opt) => {
  if (opt.value === new URLSearchParams(window.location.search).get("limit")) {
    limitValue = opt;
  }
  return;
});

if (limitValue) {
  limitValue.selected = true;
}

limit.addEventListener("change", () => {
  const url = new URL(window.location.href);
  const limitValue = document.querySelector("#displayAmount").value;
  url.search = new URLSearchParams({
    limit: limitValue,
  });
  window.location.href = url;
});
