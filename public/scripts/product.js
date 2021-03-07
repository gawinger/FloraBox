const imgContainer = document.querySelector(".product-img");
const productImg = document.querySelector(".product-img img");
const imgZoomContainer = document.querySelector(".product-zoom-container");
const imgZoom = document.querySelector(".product-img-zoom-container");
const zoomedImg = document.querySelector(".product-img-zoom img");
const closeZoomBtn = document.querySelector(".close-zoom-btn");
const productThumbnails = document.querySelectorAll(".product-img-list img");
const productImgList = document.querySelector(".product-img-list");

const setZoomedImgSrc = (e) => {
  zoomedImg.src = e.target.src;
  imgZoomContainer.classList.remove("hidden");
  window.addEventListener("click", closeZoom);
};

if (productThumbnails.length === 0) {
  imgContainer.classList.add("img100");
  productImgList.classList.add("hidden");
}

productImg.addEventListener("click", setZoomedImgSrc);
productThumbnails.forEach((img) => {
  img.addEventListener("click", setZoomedImgSrc);
});

const closeZoom = (e) => {
  // if zoom is not hidden and
  // if user clicks on img hide navbar
  if (!imgZoom.contains(e.target) && e.target !== productImg && !document.querySelector(".product-images").contains(e.target)) {
    imgZoomContainer.classList.add("hidden");
    window.removeEventListener("click", closeZoom);
  }
};

const zoomListImgs = document.querySelectorAll(".product-img-zoom-list img");
zoomListImgs.forEach((e) => {
  e.addEventListener("click", setZoomedImgSrc);
});

const visibilty = document.querySelector(".visibility");

// if user sees visibility option add listener of change and show confirm button
if (visibilty) {
  visibilty.addEventListener("change", () => {
    document.querySelector(".visibility-btn").classList.remove("hidden");
  });
}
