if (navigator.userAgent.indexOf("Edg") !== -1) {
  document.getElementById("browser").innerHTML =
    "If you are using microsoft edge, the debit/credit card payment method may work incorrectly";
  document.getElementById("browser").style.paddingBottom = "10px";
  document.getElementById("browser").style.marginBottom = "1rem";
}

let shippingZip;
let shippingCity;
let shippingAddress;
let firstName;
let lastName;
let shippingPhone;
let houseNumber;
let orderEmail;
let shippingCountry;

let isTrue = false;
let deliveryOption = "normal";
cartData.forEach((item) => {
  if (item.productDelivery === "fast") {
    isTrue = false;
  } else {
    isTrue = true;
  }
});
if (isTrue) {
  // Hide and disable phoneBlock input
  document.getElementById("phoneBlock").style.display = "none";
  document.getElementById("phoneBlock").disabled = true;
} else {
  // Show and enable phoneBlock input
  document.getElementById("phoneBlock").style.display = "block";
  document.getElementById("phoneBlock").disabled = false;
}
// Render the PayPal button
const errorMessage = document.querySelector(".error-message2");
const someDataPrice = cartData[0].productPrice;
const newDataPrice = someDataPrice.replace("$", "").replace(",", ".");
function updatePayPal() {
  // Helper / Utility functions
  let url_to_head = (url) => {
    return new Promise(function (resolve, reject) {
      var script = document.createElement("script");
      script.src = url;
      script.onload = function () {
        resolve();
      };
      script.onerror = function () {
        reject("Error loading script.");
      };
      document.head.appendChild(script);
    });
  };
  const paypal_sdk_url = "https://www.paypal.com/sdk/js";
  const client_id =
    "AXh5j1fggZvIaes8IhbEnM57pWoDNedqn5dEJ7W0RueFaYBYrkb4HShgFeUbBXTcQXCN0jZhfJ053R0E";
  const currency = "USD";
  const intent = "capture";
  url_to_head(
    paypal_sdk_url +
      "?client-id=" +
      client_id +
      "&enable-funding=venmo&currency=" +
      currency +
      "&intent=" +
      intent
  ).then(() => {
    let orderIdd;
    let paypal_buttons = paypal
      .Buttons({
        onClick: async function () {
          const response = await fetch("/check-connection", {
            method: "POST",
          });
          if (response.status === 200) {
            const isValid = await new Promise((resolve) => {
              checkAll((isValid) => {
                resolve(isValid);
              });
            });
            // const isValid = true;
            console.log(isValid);
            if (isValid) {
              return true;
            } else {
              return false;
            }
          } else {
            window.scrollTo({ top: 0, behavior: "instant" });
            document.getElementById("container").style.display = "block";
            document.getElementById("container").style.boxShadow =
              "0px 0px 500px 500px rgba(0,0,0,0.89)";

            document.querySelector(".error-box2").style.display = "block";
            document.querySelector(".error-box2").style.boxShadow =
              "0px 0px 50px 5000px rgba(0,0,0,0.89)";
            document.body.style.overflow = "hidden";
            return false;
          }
        },
        createOrder: function (data, actions) {
          return fetch("/create_order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ intent: intent }),
          })
            .then((response) => response.json())
            .then((order) => {
              return order.id;
            });
        },

        onApprove: function (data, actions) {
          let order_id = data.orderID;
          return fetch("https://preppal-test.onrender.com/complete_order", {
            method: "post",
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: JSON.stringify({
              intent: intent,
              order_id: order_id,
            }),
          })
            .then((response) => response.json())
            .then((order_details) => {
              storeOrder(); //Close out the PayPal buttons that were rendered
              paypal_buttons.close();
            })
            .catch((error) => {
              console.log(error);
            });
        },
        onError: function (err) {
          console.log(err);
          const inputText = err;

          // Use a regular expression to extract the value associated with "name"
          const nameMatch = /"name":"(.*?)"/.exec(inputText);
          const nameValue = nameMatch[1];
          switch (nameValue) {
            case "BUYER_CANCEL":
              errorMessage.innerHTML = "Transaction cancelled by buyer";
              document.getElementById("container").style.display = "block";
              document.getElementById("container").style.boxShadow =
                "0px 0px 500px 500px rgba(0,0,0,0.89)";

              document.querySelector(".error-box1").style.display = "block";
              document.querySelector(".error-box1").style.boxShadow =
                "0px 0px 50px 5000px rgba(0,0,0,0.89)";
              document.body.style.overflow = "hidden";

              window.scrollTo({ top: 0, behavior: "instant" });

              break;

            case "INSTRUMENT_DECLINED":
              errorMessage.innerHTML = "Payment method was declined";
              document.getElementById("container").style.display = "block";
              document.getElementById("container").style.boxShadow =
                "0px 0px 500px 500px rgba(0,0,0,0.89)";

              document.querySelector(".error-box1").style.display = "block";
              document.querySelector(".error-box1").style.boxShadow =
                "0px 0px 50px 5000px rgba(0,0,0,0.89)";
              document.body.style.overflow = "hidden";
              window.scrollTo({ top: 0, behavior: "instant" });

              break;

            case "PAYER_ACTION_REQUIRED":
              errorMessage.innerHTML = "Buyer action required to continue";
              document.getElementById("container").style.display = "block";
              document.getElementById("container").style.boxShadow =
                "0px 0px 500px 500px rgba(0,0,0,0.89)";

              document.querySelector(".error-box1").style.display = "block";
              document.querySelector(".error-box1").style.boxShadow =
                "0px 0px 50px 5000px rgba(0,0,0,0.89)";
              document.body.style.overflow = "hidden";
              window.scrollTo({ top: 0, behavior: "instant" });

              break;

            case "PAYMENT_FAILURE":
              errorMessage.innerHTML = "Payment failed, please try again";
              document.getElementById("container").style.display = "block";
              document.getElementById("container").style.boxShadow =
                "0px 0px 500px 500px rgba(0,0,0,0.89)";

              document.querySelector(".error-box1").style.display = "block";
              document.querySelector(".error-box1").style.boxShadow =
                "0px 0px 50px 5000px rgba(0,0,0,0.89)";
              document.body.style.overflow = "hidden";
              window.scrollTo({ top: 0, behavior: "instant" });

              break;

            case "INTERNAL_SERVICE_ERROR":
              errorMessage.innerHTML =
                "Internal service error, try again later";
              document.getElementById("container").style.display = "block";
              document.getElementById("container").style.boxShadow =
                "0px 0px 500px 500px rgba(0,0,0,0.89)";

              document.querySelector(".error-box1").style.display = "block";
              document.querySelector(".error-box1").style.boxShadow =
                "0px 0px 50px 5000px rgba(0,0,0,0.89)";
              document.body.style.overflow = "hidden";
              window.scrollTo({ top: 0, behavior: "instant" });

              break;

            case "NOT_CONFIGURED":
              errorMessage.innerHTML = "PayPal buttons not properly configured";
              document.getElementById("container").style.display = "block";
              document.getElementById("container").style.boxShadow =
                "0px 0px 500px 500px rgba(0,0,0,0.89)";

              document.querySelector(".error-box1").style.display = "block";
              document.querySelector(".error-box1").style.boxShadow =
                "0px 0px 50px 5000px rgba(0,0,0,0.89)";
              document.body.style.overflow = "hidden";
              window.scrollTo({ top: 0, behavior: "instant" });

              break;

            case "INVALID_CONFIGURATION":
              errorMessage.innerHTML = "Invalid configuration provided";
              document.getElementById("container").style.display = "block";
              document.getElementById("container").style.boxShadow =
                "0px 0px 500px 500px rgba(0,0,0,0.89)";

              document.querySelector(".error-box1").style.display = "block";
              document.querySelector(".error-box1").style.boxShadow =
                "0px 0px 50px 5000px rgba(0,0,0,0.89)";
              document.body.style.overflow = "hidden";
              window.scrollTo({ top: 0, behavior: "instant" });

              break;

            case "UNSUPPORTED_BROWSER":
              errorMessage.innerHTML =
                "This browser is not supported by PayPal";
              document.getElementById("container").style.display = "block";
              document.getElementById("container").style.boxShadow =
                "0px 0px 500px 500px rgba(0,0,0,0.89)";

              document.querySelector(".error-box1").style.display = "block";
              document.querySelector(".error-box1").style.boxShadow =
                "0px 0px 50px 5000px rgba(0,0,0,0.89)";
              document.body.style.overflow = "hidden";
              window.scrollTo({ top: 0, behavior: "instant" });

              break;

            case "BUYER_ACCOUNT_ERROR":
              errorMessage.innerHTML = "Problem with buyer PayPal account";
              document.getElementById("container").style.display = "block";
              document.getElementById("container").style.boxShadow =
                "0px 0px 500px 500px rgba(0,0,0,0.89)";

              document.querySelector(".error-box1").style.display = "block";
              document.querySelector(".error-box1").style.boxShadow =
                "0px 0px 50px 5000px rgba(0,0,0,0.89)";
              document.body.style.overflow = "hidden";
              window.scrollTo({ top: 0, behavior: "instant" });

              break;

            case "DEPOSIT_FAILED":
              errorMessage.innerHTML = "Failed to charge buyer account";
              document.getElementById("container").style.display = "block";
              document.getElementById("container").style.boxShadow =
                "0px 0px 500px 500px rgba(0,0,0,0.89)";

              document.querySelector(".error-box1").style.display = "block";
              document.querySelector(".error-box1").style.boxShadow =
                "0px 0px 50px 5000px rgba(0,0,0,0.89)";
              document.body.style.overflow = "hidden";
              window.scrollTo({ top: 0, behavior: "instant" });

              break;

            // ... other cases
            case "UNPROCESSABLE_ENTITY":
              errorMessage.innerHTML =
                "Check if your cart isn`t empty or try reloading page";
              document.getElementById("container").style.display = "block";
              document.getElementById("container").style.boxShadow =
                "0px 0px 500px 500px rgba(0,0,0,0.89)";

              document.querySelector(".error-box1").style.display = "block";
              document.querySelector(".error-box1").style.boxShadow =
                "0px 0px 50px 5000px rgba(0,0,0,0.89)";
              document.body.style.overflow = "hidden";
              window.scrollTo({ top: 0, behavior: "instant" });

              break;

            default:
              errorMessage.innerHTML = "Unknown error occurred";
          }
        },
      })
      .render("#payment_options")
      .then(function () {
        document.getElementById("loader").style.display = "none";
        document.getElementById("checkoutForm").style.display = "block";
      });
  });
}
updatePayPal(totalsum);

// Define a mapping object for country names to country codes
const countryMapping = {
  Belgium: "BE",
  "Czech Republic": "CZ",
  Denmark: "DK",
  Finland: "FI",
  France: "FR",
  Germany: "DE",
  Ireland: "IE",
  Italy: "IT",
  Luxembourg: "LU",
  Netherlands: "NL",
  Poland: "PL",
  Spain: "ES",
  Sweden: "SE",
  "United Kingdom": "GB",
  "United States": "US",
  Canada: "CA",
  "New Zealand": "NZ",
};

// Get the select element
const selectElement = document.querySelector(".country-select");
const productsess = [];
const deliveryBlock = document.querySelector(".radio-inputs");

// Loop through the cart items and create a new object for each product
for (const key in cartData) {
  const product = {
    delivery: deliveryOption,
    name: cartData[key].productTitle,
    quantity: cartData[key].productAmount,
    color: cartData[key].productColor,
  };
  productsess.push(product);
}
console.log(productsess);
// Plug mapping
const plugMapping = {
  "United States": "US",
  Canada: "US",

  "New Zealand": "AU",
  "United Kingdom": "UK",
  Ireland: "UK",

  France: "EU", // Using France as example of EU
  Germany: "EU",
};

// Video IDs
const videoIds = {
  US_white: "1636420804961382400",
  US_black: "1636420805179486208",
  AU_white: "1636420805124960256",
  AU_black: "1636420805347258368",
  UK_white: "1636420805070434304",
  UK_black: "1636420805288538112",
  EU_white: "1636420805015908352",
  EU_black: "1636420805234012160",
};

let vid;
let Date1;
let Date2;
// Add change event listener to the select element
selectElement.addEventListener("change", function () {
  deliveryBlock.innerHTML = ``;
  // Get the selected option text
  const selectedCountry = this.options[this.selectedIndex].text;

  // Get the corresponding country code from the mapping object
  const countryCode = countryMapping[selectedCountry];
  // Get plug type
  let plugType = plugMapping[selectedCountry];
  if (plugType === undefined) {
    plugType = "EU";
  }
  let quantityInner;
  // Loop through cart items
  cartData.forEach((item) => {
    // Check color
    quantityInner = item.productAmount;
    if (item.productColor === "white") {
      // Set video ID based on plug type + color
      vid = videoIds[`${plugType}_white`];
    } else {
      // Set video ID based on plug type + color
      vid = videoIds[`${plugType}_black`];
    }
  });
  fetch("/delivery-calculate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      end: countryCode,
      products: [{ quantity: quantityInner, vid: vid }],
    }),
  })
    .then((response) => response.json())
    .then((options) => {
      const REDUCE_PRICE = 23;
      // Sort options array based on delivery type
      options.sort((a, b) => {
        const order = [
          "CJPacket Ordinary",
          "CJPacket Fast Ordinary",
          "DHL Official",
        ];
        return order.indexOf(a.name) - order.indexOf(b.name);
      });
      options.forEach((option) => {
        if (option.name === "CJPacket Ordinary") {
          // Assuming option.price is the variable you want to modify
          if (option.price >= 23) {
            option.price -= 23;
          } else {
            option.price = 0;
          }
        }

        if (option.name === "CJPacket Fast Ordinary") {
          option.price = Math.max(5, option.price - REDUCE_PRICE);
        }

        if (option.name === "DHL Official") {
          option.price = Math.max(10, option.price - REDUCE_PRICE);
          option.price = Math.round(option.price * 2) / 2;
        }
      });
      // Log them to console
      options.forEach((option) => {
        let deliveryName;
        if (option.name === "CJPacket Ordinary") {
          const time = option.time;
          const [start, end] = time.split("-");
          const startNum = parseInt(start);
          const endNum = parseInt(end);
          const newEnd = endNum - 1;
          deliveryName = `Default Shipping (${startNum}-${newEnd})`;
          Date1 = startNum;
          Date2 = endNum;
        } else {
          if (option.name === "CJPacket Fast Ordinary") {
            deliveryName = `Fast Shipping (${option.time})`;
            const time = option.time;

            const [start, end] = time.split("-");
            const startNum2 = parseInt(start);
            const endNum2 = parseInt(end);
            Date1 = startNum2;
            Date2 = endNum2;
          } else {
            if (option.name === "DHL Official") {
              const time = option.time;

              deliveryName = `Express Shipping (${option.time})`;
              const [start, end] = time.split("-");
              const startNum3 = parseInt(start);
              const endNum3 = parseInt(end);
              Date1 = startNum3;
              Date2 = endNum3;
            }
          }
        }

        const deliveryOptionDiv = document.createElement("label");
        if (option.name === "CJPacket Ordinary") {
          deliveryOptionDiv.innerHTML = `              
          <input class="radio-input" type="radio" name="engine" checked>
            <span class="radio-tile">
              <span class="radio-label" data-value="${
                option.name
              }">${deliveryName}</span>
              <span class="radio-label">$${option.price.toFixed(2)}</span>
  
            </span>
        `;
        } else {
          deliveryOptionDiv.innerHTML = `              
          <input class="radio-input" type="radio" name="engine">
            <span class="radio-tile">
              <span class="radio-label" data-value="${
                option.name
              }">${deliveryName}</span>
              <span class="radio-label">$${option.price.toFixed(2)}</span>
  
            </span>
        `;
        }

        deliveryBlock.appendChild(deliveryOptionDiv);
      });
      const shippingInputs = document.querySelectorAll(".radio-input");

      shippingInputs.forEach((input) => {
        input.addEventListener("change", () => {
          const priceElement = input.nextElementSibling.querySelector(
            ".radio-label:last-child"
          );
          const price = Number(priceElement.textContent.replace("$", ""));
          const deliveryNamee = input.nextElementSibling
            .querySelector(".radio-label:first-child")
            .getAttribute("data-value");
          // Inside shipping input change handler

          const previousTotal = Number(sum);
          deliveryOption = `${deliveryNamee}`

          totalsum = previousTotal + price;
          // Inside shipping input change handler

          totalElement.innerText = `$${totalsum.toFixed(2)}`;
          // Inside shipping input change handler
          const deliveryPriceElement = document.querySelector(
            ".checkout_shipping_price"
          );
          const deliveryNameee = input.nextElementSibling.querySelector(
            ".radio-label:first-child"
          ).textContent;
          const delvierySpan = document.querySelector(".delvieryClass");
          delvierySpan.innerHTML = `${deliveryNameee}`;
          deliveryPriceElement.innerText = `$${price.toFixed(2)}`;
          fetch("/check-price", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ price: price, name: deliveryNamee }),
          }).then((response) => {
          });
          // Inside shipping input change handler
        });
      });
      // Trigger the change event for each input
      const evente = new Event("change");
      shippingInputs[0].dispatchEvent(evente);
    });
});
// Trigger change event on page load
window.addEventListener("load", () => {
  selectElement.dispatchEvent(new Event("change"));
});

async function checkAll(callbackk) {
  const validationStates = {
    name: false,
    email: false,
    phone: false,
    address: false,
    house: false,
    zip: false,
  };

  shippingZip = document.getElementById("zip").value;
  shippingCity = document.getElementById("city").value;
  shippingAddress = document.getElementById("address").value;
  firstName = document.getElementById("firstName").value;
  lastName = document.getElementById("lastName").value;
  shippingPhone = document.getElementById("phone").value;
  houseNumber = document.getElementById("house").value;
  orderEmail = document.getElementById("email").value;
  shippingCountry = document.querySelector(".form-select").value;

  function validateName() {
    if (firstName === "" || lastName === "") {
      document.querySelector(".nameError").innerHTML =
        "Please fill in all name fields.";
      validationStates["name"] = false;
    } else {
      validationStates["name"] = true;
      document.querySelector(".nameError").innerHTML = "";
    }
  }

  function validateHouse() {
    if (houseNumber === "") {
      document.querySelector(".houseError").innerHTML =
        "Please fill in the house number field.";
      validationStates["house"] = false;
    } else {
      validationStates["house"] = true;
      document.querySelector(".houseError").innerHTML = "";
    }
  }

  function validateEmail() {
    const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (emailPattern.test(orderEmail)) {
      validationStates["email"] = true;
      document.querySelector(".errorEmail").innerHTML = "";
    } else {
      document.querySelector(".errorEmail").innerHTML = "Invalid Email Address";
      validationStates["email"] = false;
    }
  }
  function isValidZip(zip, country) {
    let regex;
        // Common pattern for most countries
        const commonPattern = /^\d{5,}$/;

    switch (country) {
      case 'Belgium':
          regex = /^\d{4}$/;
          break;
      case 'Czech Republic':
          regex = /^\d{5}$/;
          break;
      case 'Denmark':
          regex = /^\d{4}$/;
          break;
      case 'Finland':
          regex = /^\d{5}$/;
          break;
      case 'France':
          regex = /^\d{5}$/;
          break;
      case 'Germany':
          regex = /^\d{5}$/;
          break;
      case 'Ireland':
          regex = /^[A-Za-z\d]{3}\s?[A-Za-z\d]{4}$/;
          break;
      case 'Italy':
          regex = /^\d{5}$/;
          break;
      case 'Luxembourg':
          regex = /^\d{4}$/;
          break;
      case 'Netherlands':
          regex = /^\d{4}\s?[A-Za-z]{2}$/;
          break;
      case 'Poland':
          regex = /^\d{2}-\d{3}$/;
          break;
      case 'Spain':
          regex = /^\d{5}$/;
          break;
      case 'Sweden':
          regex = /^\d{5}$/;
          break;
      case 'United Kingdom':
          regex = /^[A-Za-z]{1,2}\d{1,2}\s?\d[A-Za-z]{2}$/;
          break;
      case 'United States':
          regex = /^\d{5}(-\d{4})?$/;
          break;
      case 'Canada':
          regex = /^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$/;
          break;
      case 'New Zealand':
          regex = /^\d{4}$/;
          break;
      default:
        regex = commonPattern;
  }
    if (regex.test(zip) === true) {
      validationStates["zip"] = true;
      document.querySelector(".errorZip").innerHTML = "";
    } else {
      document.querySelector(".errorZip").innerHTML = "Incorrect ZIP";
    }
  }
  function validatePhone() {
    function isValidPhoneNumber(phoneNumber) {
      const phonePattern =
        /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9][0-9]{2})\s*\)|([2-9][0-9]{2}))(?:[.-]\s*)?([2-9][0-9]{2})(?:[.-]\s*)?([0-9]{4}))(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/;
      return phonePattern.test(phoneNumber);
    }

    if (!isValidPhoneNumber(shippingPhone)) {
      document.querySelector(".errorPhone").innerHTML = "Phone Is Incorrect";
      validationStates["phone"] = false;
    } else {
      validationStates["phone"] = true;
      document.querySelector(".errorPhone").innerHTML = "";
    }
  }
  function validateAddress(callback) {
    const serverData = {
      address: shippingAddress,
      city: shippingCity,
      zip: shippingZip,
      country: shippingCountry,
    };
    if (
      validationStates["zip"] === true &&
      shippingAddress !== "" &&
      shippingCity !== ""
    ) {
      document.querySelector(".errorAddress").innerHTML = "";
      document.querySelector(".cityError").innerHTML = "";

      fetch("/check-address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: serverData.address,
          city: serverData.city,
          country: serverData.country,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          const dataArray = data.data;
          if (dataArray.results.length > 0) {
            dataArray.results.forEach((obj) => {
              if (
                obj.postcode === serverData.zip &&
                obj.country === serverData.country
              ) {
                validationStates["address"] = true;
                if (obj.city !== shippingCity) {
                  // City does not match, show hint
                  document.querySelector(
                    ".hint"
                  ).innerHTML = `Did you mean <span class="hint_city" style="font-style: italic;cursor: pointer;">${obj.city}</span>?`;
                  const cityInput = document.getElementById("city");
                  document
                    .querySelector(".hint_city")
                    .addEventListener("click", function () {
                      const spanText =
                        document.querySelector(".hint_city").innerHTML;
                      cityInput.value = spanText;
                    });
                } else {
                  // Clear any previous hint
                  document.querySelector(".hint").innerHTML = "";
                }
              } else {
                console.log("country problems");
                if (obj.country !== serverData.country) {
                  document.querySelector(".countryError").innerHTML =
                    "Incorrect country";
                } else {
                  document.querySelector(".countryError").innerHTML = "";
                }
                if (obj.postcode !== serverData.zip) {
                  document.querySelector(".errorZip").innerHTML =
                    "Postal code doesnt match";
                } else {
                  document.querySelector(".errorZip").innerHTML = "";
                }
              }
            });
          } else {
            validationStates["address"] = false;
            document.querySelector(".deliveryFormError").innerHTML = "No such an adress found, recheck country/address"
            document.querySelector(".deliveryFormError").style.color = "red"
          }
          console.log(validationStates);
          callback();
        })
        .catch((error) => {
          validationStates["address"] = false;
          console.log("Error:");
          console.log(error);
          callback();
        });
    } else {
      validationStates["address"] = false;
      if (shippingAddress === "") {
        document.querySelector(".errorAddress").innerHTML =
          "Address can`t be empty";
      } else {
        document.querySelector(".errorAddress").innerHTML = "";
      }
      if (shippingCity === "") {
        document.querySelector(".cityError").innerHTML = "City can`t be empty";
      } else {
        document.querySelector(".cityError").innerHTML = "";
      }
      callback();
    }
  }

  validateName();
  validateHouse();
  validateEmail();
  isValidZip(shippingZip, shippingCountry);
  if (isTrue) {
    validationStates["phone"] = true;
  } else {
    if (isTrue === false) {
      validatePhone();
    }
  }
  validateAddress(() => {
    const isValidd = Object.values(validationStates).every(
      (value) => value === true
    );
    callbackk(isValidd);
  });
}

function storeOrder() {
  const shippingProvince = document.getElementById("province").value;
  const address2 = document.getElementById("address2").value;
  const orderNumber = Math.floor(Math.random() * 100000000 + 100000000);

  const productses = [];

  // Loop through the cart items and create a new object for each product
  for (const key in cartData) {
    const product = {
      delivery: deliveryOption,
      name: cartData[key].productTitle,
      quantity: cartData[key].productAmount,
      color: cartData[key].productColor,
    };
    productses.push(product);
  }
  const formattedProducts = productses
    .map((product) => {
      return `${product.delivery}, ${product.color} ${product.name} * ${product.quantity}`;
    })
    .join(", ");
  const orderData = {
    OrderDate: new Date(), // You can set the OrderDate to the current date/time

    OrderZip: `${shippingZip}`,
    OrderCity: `${shippingCity}`,
    OrderAddress: `${shippingAddress}`,
    LastName: `${firstName}`,
    FirstName: ` ${lastName}`,
    OrderPhone: `${shippingPhone}`,
    OrderEmail: `${orderEmail}`,
    OrderProvince: `${shippingProvince}`,
    OrderAddress2: `${address2}`,
    Total: Number(totalsum.toFixed(2)),
    OrderStatus: `New`,
    OrderTrackingNumber: "", // You can set this to an empty string initially,
    OrderProducts: formattedProducts,
    OrderNumber: orderNumber,
    OrderCountry: shippingCountry,
  };

  // Now you can use the `products` array in your code
  fetch("/create-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });
  fetch("/send-success", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      firstName: firstName,
      lastName: lastName,
      address: shippingCity + " " + shippingAddress + " " + shippingZip,
      total: totalsum,
      orderDate1: Date1,
      orderDate2: Date2,
      orderNumber: orderNumber,
      email: orderEmail,
    }),
  });
  localStorage.removeItem("cart");
  window.scrollTo({ top: 0, behavior: "instant" });
  document.getElementById("container").style.display = "block";
  document.getElementById("container").style.boxShadow =
    "0px 0px 500px 500px rgba(0,0,0,0.89)";

  document.getElementById("success-box").style.display = "block";
  document.getElementById("success-box").style.boxShadow =
    "0px 0px 50px 5000px rgba(0,0,0,0.89)";
  document.body.style.overflow = "hidden";
}
function showLoader() {
  document.querySelector("form").style.display = "none";
  const loader = document.getElementById("loader");
  loader.style.display = "block";
}
function hideLoader() {
  document.querySelector("form").style.display = "block";

  const loader = document.getElementById("loader");
  loader.style.display = "none";
}
