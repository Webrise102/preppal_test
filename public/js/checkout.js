const cartInner = document.querySelector(".modal-body");
let cartData = localStorage.getItem("cart");
if (cartData) {
  cartData = JSON.parse(cartData);
} else {
  cartData = [];
}
const buttons = document.querySelectorAll("button");
buttons.forEach((button) => {
  button.addEventListener("click", function () {
    event.preventDefault();
  });
});

// Get the "products" div to which we will append the product data
const productsDiv = document.getElementById("products");
const subTotalElement = document.querySelector(".checkout_subtotal_price");
const totalElement = document.querySelector(".checkout_total_price");
let sum = 0;
// Check if there is data in the cart
function showProducts() {
  if (cartData && Array.isArray(cartData)) {
    // Loop through each item in the cart and create product elements
    cartData.forEach((item) => {
      const productDiv = document.createElement("div");
      productDiv.classList.add("checkout_product_block");

      productDiv.innerHTML = `
      <div class="checkout_product checkout_flex">
      <div class="first_part_checkout">
        <img
          src="${item.productImage}"
          alt=""
          class="checkout_product_image"
        />
        <div class="image_popup"><p class="quantity">${item.productAmount}</p></div>
        <p class="checkout_product_title">${item.productTitle}</p>
      </div>
      <p class="checkout_product_price">${item.productPrice}</p>
    </div>`;

      // Append the product element to the "products" div
      productsDiv.appendChild(productDiv);
      const newPrices1 = item.productPrice.replace(",", ".");
      const newPrices = parseFloat(newPrices1.replace("$", ""));
      const newPrice = newPrices * item.productAmount;
      sum += newPrice;
    });
  }
}
showProducts();

subTotalElement.innerHTML = `$${sum}`;
const couponButton = document.querySelector(".applyCoupon");
const couponText = document.querySelector(".checkout_coupons_price");
let couponSale;
couponButton.addEventListener("click", function () {
  const couponSale = document.querySelector("#coupon").value;
  fetch("/check-coupon", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code: `${couponSale}` }),
  }).then((response) => {
    if (response.status === 200) {
      document.querySelector(".couponStatus").innerHTML =
        "Applied successfully";
      document.querySelector(".couponStatus").style.color = "#40d44f";
      console.log(sum);
      sum % 100 * 10
      subTotalElement.innerHTML = `$${sum}`;
      totalElement.innerHTML = `$${sum}`;
      couponText.innerHTML = "-10%";
      window.scrollTo(0, 0);
      console.log(sum);
    } else {
      document.querySelector(".couponStatus").innerHTML = "Coupon not exists";
      document.querySelector(".couponStatus").style.color = "#d44040";
    }
  });
});

totalElement.innerHTML = `$${sum}`;

const currentForm = document.getElementById("checkoutForm");
let allFormsStatus = false;
currentForm.addEventListener("submit", function (event) {});

const expand = document.getElementById("expandInfo");
const secondInfo = document.getElementById("secondInfo");
expand.addEventListener("click", function () {
  secondInfo.style.display = "block";
  expand.style.display = "none";
});

cartInner.innerHTML = `Your cart is empty`;

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
    titleParagraph.classList.add("product_title_cart");
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
      if (
        window.location.pathname === "/catalog" ||
        window.location.pathname === "/checkout"
      ) {
        location.reload();
      }
    });

    // Append the <p> elements to the div
    divParagraph.appendChild(titleParagraph);
    divParagraph.appendChild(amountBox);
    divParagraph.appendChild(deleteButton);

    // Append the div to the cartInner element
    cartInner.appendChild(divParagraph);
  });
}

// Initial rendering of the cart
updateCart();
const productAmountInner2 = document.querySelectorAll(".amountParagr");
const minusButtons2 = document.querySelectorAll(".cartDecrease");
const plusButtons2 = document.querySelectorAll(".cartIncrease");

minusButtons2.forEach((minus, index) => {
  minus.addEventListener("click", function () {
    const currentAmount = parseInt(productAmountInner2[index].innerHTML);
    if (currentAmount > 1) {
      productAmountInner2[index].innerHTML = currentAmount - 1;
      updateCartInner(index, currentAmount - 1);
      location.reload();
    }
  });
});

plusButtons2.forEach((plus, index) => {
  plus.addEventListener("click", function () {
    const currentAmount = parseInt(productAmountInner2[index].innerHTML);
    productAmountInner2[index].innerHTML = currentAmount + 1;
    updateCartInner(index, currentAmount + 1);
    location.reload();
  });
});

function updateCartInner(index, newAmount) {
  // Update the cartData with the new amount for the corresponding product.
  const productTitle = cartData[index].productTitle;
  const productPrice = cartData[index].productPrice;
  const existingItem = cartData[index];

  cartData[index] = {
    ...existingItem,

    productTitle: productTitle,
    productAmount: newAmount,
    productPrice: productPrice,
  };

  // Update the cartData in localStorage.
  localStorage.setItem("cart", JSON.stringify(cartData));
}
