const hamBtn = document.querySelector("#hamburger");
const navbar = document.querySelector(".navbar");
const li = document.querySelector(".nav-list");

const closeNav = (e) => {
  // if navbar is not hidden and
  // if user clicks on navbar or hamburger button hide navbar
  if (!navbar.contains(e.target) && e.target !== hamBtn) {
    navbar.classList.remove("show-nav");
    window.removeEventListener("click", closeNav);
  }
};

// on click on hamburger button toggle show-nav class
hamBtn.addEventListener("click", () => {
  navbar.classList.toggle("show-nav");
  window.addEventListener("click", closeNav);
});

const mobileWidth = window.matchMedia("(max-width: 1024px)");
const dropdownLinks = document.querySelectorAll(".dropdown-link");

dropdownLinks.forEach((e) => {
  e.addEventListener("click", () => {
    // if window width is lower than 1024px remove hrefs from dropdown nav-links
    if (mobileWidth.matches) {
      e.href = "#";
      e.parentNode.lastElementChild.classList.toggle("mobile-show");
    }
  });
});

const closeAlertBtn = document.querySelector(".cart-add-alert .close");
closeAlertBtn.addEventListener("click", () => {
  document.querySelector(".cart-add-alert").classList.add("hidden");
});
