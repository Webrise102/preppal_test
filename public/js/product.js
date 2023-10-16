const mainImage = document.querySelector(".main-image");
const thumbnails = document.querySelectorAll(".thumbnail");2

let currentImageIndex = 0;
const currentLocation = window.location.pathname
let images;
if(currentLocation === "/fast-defrost-tray") {
  images = [
    "../images/tray_preview1.webp",
    "../images/tray_preview2.webp",
    "../images/tray_preview3.webp",
  ];
}
let vid;
if(window.location.pathname === "/fast-defrost-tray") {
  vid = "F616DF14-C0BF-4BDC-AE52-75664D36218D"
}


function updateMainImage() {
  mainImage.src = images[currentImageIndex];
}

thumbnails.forEach((thumbnail, index) => {
  thumbnail.addEventListener("click", () => {
    currentImageIndex = index;
    updateMainImage();
  });
});

mainImage.addEventListener("click", () => {
  const zoomedImage = document.createElement("img");
  const crossButton = document.createElement("button");
  crossButton.classList.add("close_image");
  crossButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
  zoomedImage.alt = "Mini Electric Juicer";
  zoomedImage.src = mainImage.src;
  zoomedImage.classList.add("zoom_image");
  document.body.style.overflow = "hidden";
  document.body.appendChild(zoomedImage);
  document.body.appendChild(crossButton);

  crossButton.addEventListener("click", () => {
    document.body.removeChild(zoomedImage);
    document.body.removeChild(crossButton);

    document.body.style.overflow = "";
  });
});
const cartButton = document.querySelectorAll(".cart__button");
cartButton.forEach((button) => {
  button.addEventListener("click", cartClick);
});

function cartClick() {
  let button = this;
  button.classList.add("clicked");
}

const decreaseAmount = document.getElementById("productMinus");
const increaseAmount = document.getElementById("productPlus");
const productAmount = document.getElementById("productAmount");
const productAmount2 = document.getElementById("productAmount");
const productTitle = document.querySelector(".product_title").innerHTML;
const productImage = document.querySelector(".main-image").src;
const productDescription = document.querySelector(".product_subdesc").innerHTML;

const addToCart = document.querySelector(".cart__button");
const cartInner = document.querySelector(".modal-body");
const productPrice = document.querySelector(".product_priceSale").innerHTML;
window.onload = productAmount.innerHTML = `1`;
let cartData = localStorage.getItem("cart");
if (cartData) {
  cartData = JSON.parse(cartData);
} else {
  cartData = [];
}

cartInner.innerHTML = ``;

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

// Initial rendering of the cart
updateCart();
decreaseAmount.addEventListener("click", function () {
  if (productAmount.innerHTML > 1) {
    productAmount.innerHTML--; // Increment the displayed amount

    // Check if the item was found in cartData
    if (existingItemIndex !== -1) {
      // Calculate the new amount based on the displayed amount
      const newAmount = parseInt(productAmount.innerHTML);

      // Update the amount in the cart modal and call updateCartInner
      const amountBox =
        document.querySelectorAll(".amountBox")[existingItemIndex];
      const amountParagraph = amountBox.querySelector(".amountParagr");
      amountParagraph.textContent = newAmount;

      // Call the updateCartInner function with the correct index and newAmount
      updateCartInner(existingItemIndex, newAmount);
      updateCartData()
      updateCart()
    } else {
      updateCartData()
      updateCart()    }
  }
});
const cartTitle = document.querySelectorAll(".titleParagr");
increaseAmount.addEventListener("click", function () {
  console.log(productAmount)

  productAmount.innerHTML++; // Increment the displayed amount
  console.log(productAmount)

  // Check if the item was found in cartData
  if (existingItemIndex !== -1) {
    // Calculate the new amount based on the displayed amount
    const newAmount = parseInt(productAmount.innerHTML);

    // Update the amount in the cart modal and call updateCartInner
    const amountBox =
      document.querySelectorAll(".amountBox")[existingItemIndex];
    const amountParagraph = amountBox.querySelector(".amountParagr");
    amountParagraph.textContent = newAmount;

    // Call the updateCartInner function with the correct index and newAmount
    updateCartInner(existingItemIndex, newAmount);
  } else {
    updateCartData();
    // You can also update the UI here to indicate that the product was added to the cart
    addToCart.classList.add("clicked");
    addToCart.disabled = true;
    updateCart()
  }
});
const productTitles = document.querySelectorAll("#title");
const productAmounts = document.querySelectorAll("#amount");
const existingItemIndex2 = cartData.findIndex(
  (item) => item.productTitle === productTitle
);
if (existingItemIndex2 !== -1) {
  addToCart.innerHTML = `Added`;
  addToCart.classList.add("clicked_cart")
  addToCart.disabled = true;
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
    productAmount: parseInt(productAmount.innerHTML),
    productPrice: productPrice,
    productImage: productImage,
    productDescription: productDescription,
    productVid: vid
  });
  addToCart.classList.add("clicked");
  addToCart.disabled = true;

  // Save the updated cartData back to localStorage
  localStorage.setItem("cart", JSON.stringify(cartData));
  productTitles.forEach((title, index) => {
    if (title.innerHTML == `${productTitle}`) {
      // productAmounts.forEach((amount) => {
      //   amount.innerHTML = `${cartData[existingItemIndex].productAmount}`
      // })
      productAmounts[index].textContent =
        cartData[existingItemIndex].productAmount;
    } else {
    }
  });
}

// Initialize productAmount from localStorage
const existingItemIndex = cartData.findIndex(
  (item) => item.productTitle === productTitle
);
if (existingItemIndex !== -1) {
  productAmount.innerHTML = cartData[existingItemIndex].productAmount;
}

addToCart.addEventListener("click", function () {
  updateCartData();
  updateCart()
  // You can also update the UI here to indicate that the product was added to the cart
  addToCart.classList.add("clicked");
  addToCart.disabled = true;
});

function updateAmountInBothPlaces(index, newAmount) {
  // Update the cart modal
  const amountBox = document.querySelectorAll(".amountBox")[index];
  const amountParagraph = amountBox.querySelector(".amountParagr");
  amountParagraph.textContent = newAmount;

  // Update the default amount on the product page
  productAmount.innerHTML = newAmount;

  // Update the productAmount variable in the cartData
  cartData[index].productAmount = newAmount;
}

function updateCartInner(index, newAmount) {
  // Update the cartData with the new amount for the corresponding product.
  const productTitle = cartData[index].productTitle;
  const productPrice = cartData[index].productPrice;

  cartData[index] = {
    productTitle: productTitle,
    productAmount: newAmount,
    productPrice: productPrice,
    productImage: productImage,
    productDescription: productDescription,
  };

  // Update the cartData in localStorage.
  localStorage.setItem("cart", JSON.stringify(cartData));
}
