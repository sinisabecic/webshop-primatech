//* Korpa sidebar

// LISTENERS
document.querySelector(".cart").addEventListener("click", showCart);

// FUNCTIONS
function showCart() {
  //   document.querySelector(".sidebar").removeAttribute("hidden");
  document.querySelector(".sidebar").classList.toggle("cart-sidebar");
}
