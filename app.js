//* Korpa sidebar

// LISTENERS
// document.querySelector(".cart").addEventListener("click", showCart);
document.querySelector("#search-input").addEventListener("click", searchShow);

document
  .querySelector(".search-overlay")
  .addEventListener("click", searchClose);

// FUNCTIONS

function searchShow() {
  document.querySelector(".search-overlay").classList.toggle("open");
  document.querySelector(".search-results").toggleAttribute("hidden");
}
function searchClose() {
  document.querySelector(".search-overlay").classList.remove("open");
  document.querySelector(".search-results").toggleAttribute("hidden");
}

//* Karusel
tns();
