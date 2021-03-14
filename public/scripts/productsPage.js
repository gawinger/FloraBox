let currentPage;
// if there are pages change style of current page Number
if (document.querySelector(".product-page")) {
  currentPage = document.querySelector(`.product-page .page-1`);
}
if (window.location.search && window.location.search.toString().includes("p=")) {
  const currentPageNum = window.location.search.toString().substring(3);
  currentPage = document.querySelector(`.product-page .page-${currentPageNum}`);
}
currentPage.classList.add("current-page");
