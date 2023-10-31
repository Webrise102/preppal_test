const header = document.querySelector("header");
header.innerHTML = `
<h6 class="header_title">FREE SHIPPING</h6>`;

const nav = document.querySelector("nav");
nav.innerHTML = `
<div class="sidebar">
<svg class="sidebar_button" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
<div class="sidebar_content">
<svg class="sidebar_close" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
  <ul class="sidebar_list">
    <li><a href="/" class="sidebar_link">Home</a
    ></li><li><a href="/catalog" class="sidebar_link">Catalog</a
    ></li><li><a href="/track" class="sidebar_link">Track your order</a
    ></li><li><a href="/contact" class="sidebar_link">Contact</a></li>
  </ul>
</div>
</div>
<div class="logo">
<img src="images/Logo.png" alt="PrepPal Logo" class="nav_logo" />
</div>
<div class="nav_linksBox">
<a href="/" class="nav_link">Home</a
><a href="/catalog" class="nav_link">Catalog</a
><a href="/track" class="nav_link">Track your order</a
><a href="/contact" class="nav_link">Contact</a>
</div>
<div class="search_bar">
<input type="text" class="nav_search" placeholder="Search..." />
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="#353535"
  stroke-width="1"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="search_svg"
  onclick="searchProduct(this.previousElementSibling)"
>
  <circle cx="11" cy="11" r="8"></circle>
  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
</svg>
<svg class="close_search" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>

</div>
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="#FFFFFF"
  stroke-width="1"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="search_svg2"
>
  <circle cx="11" cy="11" r="8"></circle>
  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
</svg>
<svg class="cart_button side-cart-button" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V6l-3-4H6zM3.8 6h16.4M16 10a4 4 0 1 1-8 0"/></svg>
<div class="side-cart">
<svg class="close_side-cart" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
  <h2>Your Cart</h2>
  <ul class="modal-body">
  <li>Your cart is empty</li>
  </ul>
  <button class="checkout_btn" onclick="window.location.href='/checkout'"> Checkout
  </button></div>
`;
const checkoutBtn = document.querySelector('.checkout_btn');

checkoutBtn.addEventListener('click', function() {
  this.style.boxShadow = '0 0 33px #121212';
  this.style.backgroundColor = '#ffffff';
  this.style.color = '#000000';
  this.style.transform = 'scale(0.95)';
});

const footer = document.querySelector("footer");
footer.innerHTML = `      <div class="footer_part">
<div class="footer_subsribeBlock">
  <h6 class="footer_subscribeTitle">
    Join the club & get the benefits!
  </h6>
  <div class="error-message">
  Not a valid email
</div>
  <div class="footer_subscribeInput_block">
    <input
      type="text"
      class="footer_subscribeInput"
      placeholder="your@gmail.com"
    /><button class="footer_subscribeButton">Sign up</button>
  </div>
</div>
<div class="footer_linksBlock"><a href="/shipping-policy" class="footer_link footer_link2">Shipping Policy</a
  ><a href="/refund-policy" class="footer_link">Refund Policy</a>
</div>
</div>
<div class="line"></div>
<div class="footer_part">
<div class="footer_cardsBlock">
  <img src="images/cards/Visa.svg" alt="Visa Card" class="footer_card" /><img
    src="images/cards/Mastercard.svg"
    alt="Mastercard Card"
    class="footer_card"
  /><img
    src="images/cards/Amex.svg"
    alt="American Express Card"
    class="footer_card"
  /><img
    src="images/cards/Discover.svg"
    alt="Discover Card"
    class="footer_card"
  /><img src="images/cards/Paypal.svg" alt="PayPal Card" class="footer_card" />
  <img src="images/cards/SEPA.svg" alt="SEPA Card" class="footer_card" />
</div>
<p class="footer_company">©2023, PrepPal™</p>
</div>`;

// Your existing local.js code here
document.querySelector(".error-message").classList.add("unactive");

// For validating an email
const validateEmail = function (email) {
  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email);
};
// For verifying a subscription
const subscribe = async function () {
  // Get the value of the input
  let input = document.querySelector(
    '.footer_subscribeInput_block input[type="text"]'
  ).value;
  console.log(input);
  // Validate if it's an email
  if (!validateEmail(input)) {
    // Show an error if it's not
    document.querySelector(".error-message").innerHTML = "Not a valid email";
    document.querySelector(".error-message").classList.add("active-error");
  } else {
    // Otherwise post to our subscribe endpoint
    let postEmailSubscription = await fetch("/subscribe/email", {
      method: "POST",
      body: JSON.stringify({
        email: input,
      }),
      headers: {
        "content-type": "application/json",
      },
    });

    // Get the response
    let getResponse = await postEmailSubscription.json();
    console.log(getResponse);
    if (getResponse.code == "02") {
      document.querySelector(".error-message").innerHTML =
        "User has already subscribed";
      document.querySelector(".error-message").classList.add("active-error");
    }


    // Show the appropriate response
    if (getResponse.code == "03") {
      localStorage.setItem("#subscribe", input);
      document.querySelector(".error-message").innerHTML =
      "Subscribed successfully";
    document.querySelector(".error-message").classList.add("active-success");
    } else {
      setTimeout(function () {
        document
          .querySelector(".error-message")
          .classList.remove("active-success");
      }, 3000);
    }
  }
};

// If the user clicks subscribe submit their subscription
document
  .querySelector(".footer_subscribeButton")
  .addEventListener("click", function (e) {
    subscribe();
  });

// If the user presses enter submit their subscription
document
  .querySelector(".footer_subscribeInput")
  .addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {
      subscribe();
    }
  });
const sideCart = document.querySelector(".side-cart");
const sideCartButton = document.querySelector(".side-cart-button");
const sidebarButton = document.querySelector(".sidebar_button");
const sidebar = document.querySelector(".sidebar_content");
const sideBarClose = document.querySelector(".sidebar_close");
const closeSearch = document.querySelector(".close_search");
sideCartButton.addEventListener("click", function () {
  sideCart.classList.toggle("open");
  if (document.querySelector(".openedSide")) {
    sidebar.classList.remove("openedSide");
  }
});

document.addEventListener("click", function (event) {
  if (
    !sideCart.contains(event.target) &&
    !sideCartButton.contains(event.target)
  ) {
    sideCart.classList.remove("open");
  }
});
document
  .querySelector(".close_side-cart")
  .addEventListener("click", function (event) {
    sideCart.classList.remove("open");
  });

sidebarButton.addEventListener("click", function () {
  sidebar.classList.toggle("openedSide");
});
sideBarClose.addEventListener("click", function () {
  sidebar.classList.remove("openedSide");
});
const searchBar = document.querySelector(".search_bar");
const searchSvg2 = document.querySelector(".search_svg2");

searchSvg2.addEventListener("click", function () {
  searchBar.classList.toggle("showe");
});

document.addEventListener("click", function (event) {
  if (!searchBar.contains(event.target) && !searchSvg2.contains(event.target)) {
    searchBar.classList.remove("showe");
  }
});
closeSearch.addEventListener("click", function () {
  searchBar.classList.remove("showe");
});
