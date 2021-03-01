const imgContainer = document.querySelector(".product-img");
const productImg = document.querySelector(".product-img img");
const imgZoomContainer = document.querySelector(".product-zoom-container");
const imgZoom = document.querySelector(".product-img-zoom-container");
const zoomedImg = document.querySelector(".product-img-zoom img");
const closeZoomBtn = document.querySelector(".close-zoom-btn");
const productThumbnails = document.querySelectorAll(".product-img-list img");
const productImgList = document.querySelector(".product-img-list img");

const setZoomedImgSrc = (e) => {
  zoomedImg.src = e.target.src;
  imgZoomContainer.classList.remove("hidden");
  window.addEventListener("click", closeZoom);
};

productImg.addEventListener("click", setZoomedImgSrc);

productThumbnails.forEach((img) => {
  img.addEventListener("click", setZoomedImgSrc);
});

const closeZoom = (e) => {
  // if navbar is not hidden and
  // if user clicks on navbar or hamburger button hide navbar
  if (!imgZoom.contains(e.target) && e.target !== productImg && !productImgList.contains(e.target)) {
    imgZoomContainer.classList.add("hidden");
    window.removeEventListener("click", closeZoom);
  }
};

const zoomListImgs = document.querySelectorAll(".product-img-zoom-list img");
zoomListImgs.forEach((e) => {
  e.addEventListener("click", setZoomedImgSrc);
});
