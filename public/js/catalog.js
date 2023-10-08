const cartButton = document.querySelectorAll(".cart__button");
cartButton.forEach((button) => {
  button.addEventListener("click", cartClick);
});

function cartClick() {
  let button = this;
  button.classList.add("clicked");
}

