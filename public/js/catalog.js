const cartButton = document.querySelectorAll(".cart__button");
cartButton.forEach((button) => {
  button.addEventListener("click", cartClick);
});

function cartClick() {
  let button = this;
  button.classList.add("clicked");
}
// Get the addToCart button
const addToCartButton = document.querySelectorAll(".cart__button");
let productTitle;
let productVID;
let productImage;
let productDescription;
let productPrice;
function updateCart() {
  // Clear the cartInner
  if (cartData !== null && cartData.length > 0) {
    // Code to execute if cartData is not null and not an empty array
    cartInner.innerHTML = ``;
  } else {
    cartInner.innerHTML = `Your cart is empty`;
  }

  // Update the localStorage with the modified cartData
  localStorage.setItem("cart", JSON.stringify(cartData));

  // Loop through each item in cartData
  cartData.forEach((cartItem, index) => {
    const productTitle = cartItem.productTitle;
    const productAmount = cartItem.productAmount;

    // Create a div to hold the item information
    const divParagraph = document.createElement("div");
    divParagraph.classList.add("cart_product");

    // Create <p> elements for the title and amount
    const titleParagraph = document.createElement("p");
    titleParagraph.classList.add("titleParagr");
    const amountParagraph = document.createElement("p");
    amountParagraph.classList.add("amountParagr");
    const deleteButton = document.createElement("button");
    const minusButton = document.createElement("button");
    const plusButton = document.createElement("button");
    const amountBox = document.createElement("div");
    minusButton.textContent = "-";
    plusButton.textContent = "+";
    minusButton.classList.add("cartDecrease");
    plusButton.classList.add("cartIncrease");
    deleteButton.classList.add("delete");
    deleteButton.textContent = `x`;
    amountBox.appendChild(minusButton);
    amountBox.appendChild(amountParagraph);
    amountBox.appendChild(plusButton);
    amountBox.classList.add("amountBox");

    // Set the text content of the <p> elements
    titleParagraph.textContent = productTitle;
    amountParagraph.textContent = productAmount;

    // Add a click event listener to the delete button
    deleteButton.addEventListener("click", () => {
      // Remove the item from cartData
      cartData.splice(index, 1);

      // Update the cart on the webpage and localStorage
      updateCart();
      location.reload();
    });

    // Append the <p> elements to the div
    divParagraph.appendChild(titleParagraph);
    divParagraph.appendChild(amountBox);
    divParagraph.appendChild(deleteButton);

    // Append the div to the cartInner element
    cartInner.appendChild(divParagraph);
  });
  const productAmountInner = document.querySelectorAll(".amountParagr");
  const minusButtons = document.querySelectorAll(".cartDecrease");
  const plusButtons = document.querySelectorAll(".cartIncrease");

  plusButtons.forEach((plus, index) => {
    plus.addEventListener("click", function () {
      const currentAmount = parseInt(productAmountInner[index].innerHTML);
      const newAmount = currentAmount + 1;
      productAmountInner[index].innerHTML = newAmount;
      updateCartInner(index, newAmount); // Update cart modal
      updateAmountInBothPlaces(index, newAmount); // Update product page
    });
  });

  minusButtons.forEach((minus, index) => {
    minus.addEventListener("click", function () {
      const currentAmount = parseInt(productAmountInner[index].innerHTML);
      if (currentAmount > 1) {
        const newAmount = currentAmount - 1;
        productAmountInner[index].innerHTML = newAmount;
        updateCartInner(index, newAmount); // Update cart modal
        updateAmountInBothPlaces(index, newAmount); // Update product page
      }
    });
  });
}
function updateCartData() {
  const existingItemIndex = cartData.findIndex(
    (item) => item.productTitle === productTitle
  );

  if (existingItemIndex !== -1) {
    // If the product is already in the cart, remove it before updating
    cartData.splice(existingItemIndex, 1);
  }
  if (existingItemIndex == -1) {
  }

  // Add the updated product to the cart
  cartData.push({
    productTitle: productTitle,
    productAmount: 1,
    productPrice: productPrice,
    productImage: productImage,
    productDescription: productDescription,
    productVid: productVID,
  });

  // Save the updated cartData back to localStorage
  localStorage.setItem("cart", JSON.stringify(cartData));
}
addToCartButton.forEach((button) => {
  let productTitleInner = button
    .closest(".search_product_card")
    .querySelector(".search_product_title")
    .innerHTML.trim();
  const existingItemIndex2 = cartData.findIndex(
    (item) => item.productTitle === productTitleInner
  );
  console.log(existingItemIndex2);
  if (existingItemIndex2 !== -1) {
    button.innerHTML = `Added`;
    button.classList.add("clicked_cart");
    button.disabled = true;
  }
});

// Add event listener to the button
addToCartButton.forEach((button) => {
  button.addEventListener("click", function () {
    productTitle = button
      .closest(".search_product_card")
      .querySelector(".search_product_title")
      .innerHTML.trim();
    productVID = button
      .closest(".search_product_card")
      .querySelector(".vid")
      .innerHTML.trim();
    productImage = button
      .closest(".search_product_card")
      .querySelector(".search_product_image").src;
    productDescription = button
      .closest(".search_product_card")
      .querySelector(".description")
      .innerHTML.trim();
    // Your logic for adding to cart goes here
    productPrice = button
      .closest(".search_product_card")
      .querySelector(".price_new")
      .innerHTML.trim();
    console.log(productTitle);
    updateCartData();
    updateCart();

    // Indicate that the product was added to the cart
    button.classList.add("clicked");
    button.disabled = true;
  });
});
