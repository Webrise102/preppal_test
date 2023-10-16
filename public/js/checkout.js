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
      sum += newPrices;
    });
  }
}
showProducts()
console.log(sum);

subTotalElement.innerHTML = `$${sum}.00`;
const couponButton = document.querySelector(".applyCoupon");
const couponText = document.querySelector(".checkout_coupons_price")
let couponSale;
couponButton.addEventListener("click", function () {
  const couponSale = document.querySelector("#coupon").value
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
      console.log(sum)
      sum -= 5
      sum = parseInt(sum.toFixed(2))
      subTotalElement.innerHTML = `$${sum}.00`;
      totalElement.innerHTML = `$${sum}.00`;
      couponText.innerHTML = "-10%"
      window.scrollTo(0, 0);
      console.log(sum)



    } else {
      document.querySelector(".couponStatus").innerHTML = "Coupon not exists";
      document.querySelector(".couponStatus").style.color = "#d44040";

    }
  });
});


  totalElement.innerHTML = `$${sum}.00`;


// Add an event listener for delete buttons
const deleteButtons = document.querySelectorAll(".delete");
deleteButtons.forEach((deleteButton) => {
  deleteButton.addEventListener("click", function () {
    const index = this.getAttribute("data-index");

    // Remove the product element from the DOM
    const productDiv = this.closest(".checkout_product_block");
    productDiv.remove();

    // Remove the corresponding item from cartData
    cartData.splice(index, 1);

    // Update the cartData in localStorage
    localStorage.setItem("cart", JSON.stringify(cartData));
  });
});

const productAmountInner = document.querySelectorAll(".product_quantity");
const minusButtons = document.querySelectorAll(".product_minus");
const plusButtons = document.querySelectorAll(".product_plus");
const productTotal = document.querySelectorAll(".product_total");
minusButtons.forEach((minus, index) => {
  minus.addEventListener("click", function () {
    const currentAmount = parseInt(productAmountInner[index].innerHTML);
    const currentTotal = Number(productTotal[index].innerHTML.replace("£", ""));
    if (currentAmount > 1) {
      const currentAmount = parseInt(productAmountInner[index].innerHTML);
      const newTotal = (currentTotal / currentAmount) * (currentAmount - 1);
      productTotal[index].innerHTML = `£${newTotal}`;

      productAmountInner[index].innerHTML = currentAmount - 1;
      updateCartInner(index, currentAmount - 1);
    }
  });
});

plusButtons.forEach((plus, index) => {
  plus.addEventListener("click", function () {
    const currentTotal = Number(productTotal[index].innerHTML.replace("£", ""));

    const currentAmount = parseInt(productAmountInner[index].innerHTML);
    const newTotal = (currentTotal / currentAmount) * (currentAmount + 1);
    productTotal[index].innerHTML = `£${newTotal}`;
    productAmountInner[index].innerHTML = currentAmount + 1;
    updateCartInner(index, currentAmount + 1);
  });
});
// Assuming you have HTML elements with a class "truncate-me"
const elementsToTruncate = document.querySelectorAll(".product_description");
const maxLength = 50; // Set your desired maximum length

elementsToTruncate.forEach(function (element) {
  const originalText = element.textContent;

  if (originalText.length > maxLength) {
    const truncatedText = originalText.substring(0, maxLength) + "...";
    element.textContent = truncatedText;
  }
});

const currentForm = document.getElementById("checkoutForm");
let allFormsStatus = false;
console.log(currentForm);
currentForm.addEventListener("submit", function (event) {});

const expand = document.getElementById("expandInfo");
const secondInfo = document.getElementById("secondInfo");
expand.addEventListener("click", function () {
  secondInfo.style.display = "block";
  expand.style.display = "none";
});
