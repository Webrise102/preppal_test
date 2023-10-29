if (navigator.userAgent.indexOf("Edg") !== -1) {
  document.getElementById("browser").innerHTML = "If you are using microsoft edge, the debit/credit card payment method may work incorrectly"
  document.getElementById("browser").style.paddingBottom = "10px"
  document.getElementById("browser").style.marginBottom = "1rem"

}


let isTrue = false; 
cartData.forEach((item) => {
  if(item.productDelivery === "fast") {
    isTrue = false
  } else {
    isTrue = true
  }
})
if (isTrue) {
  // Hide and disable phoneBlock input
  document.getElementById('phoneBlock').style.display = 'none'; 
  document.getElementById('phoneBlock').disabled = true;

} else {

    // Show and enable phoneBlock input
    document.getElementById('phoneBlock').style.display = 'block';
    document.getElementById('phoneBlock').disabled = false;
}
// Render the PayPal button
const errorMessage = document.querySelector(".error-message2");
paypal
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
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: `${totalsum}`, // Set the payment amount here
            },
          },
        ],
        application_context: { shipping_preference: "NO_SHIPPING" },
      });
    },
    onApprove: function (data, actions) {
      return actions.order.capture().then(function (details) {
        console.log(details);
        storeOrder();
        // Close the PayPal tab here if needed
        // window.close();
      });
    },
    onError: function (err) {
      const inputText = err;

      // Use a regular expression to extract the value associated with "name"
      const nameMatch = /"name":"(.*?)"/.exec(inputText);
      const nameValue = nameMatch[1];
      console.log(nameValue); // This will log "UNPROCESSABLE_ENTITY"
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
          break;

        case "INTERNAL_SERVICE_ERROR":
          errorMessage.innerHTML = "Internal service error, try again later";
          document.getElementById("container").style.display = "block";
          document.getElementById("container").style.boxShadow =
            "0px 0px 500px 500px rgba(0,0,0,0.89)";

          document.querySelector(".error-box1").style.display = "block";
          document.querySelector(".error-box1").style.boxShadow =
            "0px 0px 50px 5000px rgba(0,0,0,0.89)";
          document.body.style.overflow = "hidden";
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
          break;

        case "UNSUPPORTED_BROWSER":
          errorMessage.innerHTML = "This browser is not supported by PayPal";
          document.getElementById("container").style.display = "block";
          document.getElementById("container").style.boxShadow =
            "0px 0px 500px 500px rgba(0,0,0,0.89)";

          document.querySelector(".error-box1").style.display = "block";
          document.querySelector(".error-box1").style.boxShadow =
            "0px 0px 50px 5000px rgba(0,0,0,0.89)";
          document.body.style.overflow = "hidden";
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
          break;

        // ... other cases
        case "UNPROCESSABLE_ENTITY":
          errorMessage.innerHTML = "Check if your cart isn`t empty or try reloading page";
          document.getElementById("container").style.display = "block";
          document.getElementById("container").style.boxShadow =
            "0px 0px 500px 500px rgba(0,0,0,0.89)";

          document.querySelector(".error-box1").style.display = "block";
          document.querySelector(".error-box1").style.boxShadow =
            "0px 0px 50px 5000px rgba(0,0,0,0.89)";
          document.body.style.overflow = "hidden";
          break;

        default:
          errorMessage.innerHTML = "Unknown error occurred";
      }
    },
  })
  .render("#paypal-button-container")
  .then(function () {
    document.getElementById("loader").style.display = "none";
    document.getElementById("checkoutForm").style.display = "block";
  });

async function checkAll(callbackk) {
  const validationStates = {
    name: false,
    email: false,
    phone: false,
    address: false,
    state: false,
    house: false,
  };

  const shippingZip = document.getElementById("zip").value;
  const shippingProvince = document.getElementById("province").value;
  const shippingCity = document.getElementById("city").value;
  const shippingAddress = document.getElementById("address").value;
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const shippingPhone = document.getElementById("phone").value;
  const houseNumber = document.getElementById("house").value;
  const orderEmail = document.getElementById("email").value;

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

  function validateState() {
    const stateCodes = {
      alabama: "AL",
      alaska: "AK",
      arizona: "AZ",
      arkansas: "AR",
      california: "CA",
      colorado: "CO",
      connecticut: "CT",
      delaware: "DE",
      florida: "FL",
      georgia: "GA",
      hawaii: "HI",
      idaho: "ID",
      illinois: "IL",
      indiana: "IN",
      iowa: "IA",
      kansas: "KS",
      kentucky: "KY",
      louisiana: "LA",
      maine: "ME",
      maryland: "MD",
      massachusetts: "MA",
      michigan: "MI",
      minnesota: "MN",
      mississippi: "MS",
      missouri: "MO",
      montana: "MT",
      nebraska: "NE",
      nevada: "NV",
      "new hampshire": "NH",
      "new jersey": "NJ",
      "new mexico": "NM",
      "new york": "NY",
      "north carolina": "NC",
      "north dakota": "ND",
      ohio: "OH",
      oklahoma: "OK",
      oregon: "OR",
      pennsylvania: "PA",
      "rhode island": "RI",
      "south carolina": "SC",
      "south dakota": "SD",
      tennessee: "TN",
      texas: "TX",
      utah: "UT",
      vermont: "VT",
      virginia: "VA",
      washington: "WA",
      "west virginia": "WV",
      wisconsin: "WI",
      wyoming: "WY",
    };
    const stateName = shippingProvince.toLowerCase().trim();
    const stateCode = stateCodes[stateName] || false;
    if (stateCode === false) {
      document.querySelector(".errorState").innerHTML = "State Not Found";
      validationStates["state"] = false;
    } else {
      validationStates["state"] = true;
      document.querySelector(".errorState").innerHTML = "";
    }
    return stateCode;
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
  const stateCode = validateState();
  function validateAddress(callback) {
    const serverData = {
      address: shippingAddress,
      city: shippingCity,
      zip: shippingZip,
      state: stateCode,
    };

    fetch("/check-address", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(serverData),
    })
      .then((response) => {
        if (response.status === 400) {
          document.querySelector(".errorAddress").innerHTML =
            "Address/City Incorrect";

          validationStates["address"] = false;
        }
        if (response.status === 200) {
          document.querySelector(".errorAddress").innerHTML = "";
          validationStates["address"] = true;
        }

        callback();
      })
      .catch((error) => {
        document.querySelector(".errorAddress").innerHTML =
          "Address/City Incorrect";

        validationStates["address"] = false;
        callback();
      });
  }

  validateName();
  validateHouse();
  validateEmail();
  validateState();
  if(isTrue) {
    validationStates["phone"] = true;

  } else {
    if(isTrue === false) {
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
  const shippingZip = document.getElementById("zip").value;
  const shippingProvince = document.getElementById("province").value;
  const shippingCity = document.getElementById("city").value;
  const shippingAddress = document.getElementById("address").value;
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const shippingPhone = document.getElementById("phone").value;
  const address2 = document.getElementById("address2").value;
  const orderEmail = document.getElementById("email").value;
  const orderNumber = Math.floor((Math.random() * 100000000) + 100000000)

  const productses = [];

  // Loop through the cart items and create a new object for each product
  console.log(cartData);
  for (const key in cartData) {
    const product = {
      name: cartData[key].productTitle,
      quantity: cartData[key].productAmount,
      color: cartData[key].productColor,
    };
    productses.push(product);
    console.log(product);
  }
  const formattedProducts = productses
    .map((product) => {
      return `${product.color} ${product.name} * ${product.quantity}`;
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
    Total: totalsum,
    OrderStatus: `New`,
    OrderTrackingNumber: "", // You can set this to an empty string initially,
    OrderProducts: formattedProducts,
    OrderNumber: orderNumber,
  };
  console.log(orderData.OrderProducts);

  // Now you can use the `products` array in your code
  console.log(productses);
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
      total: sum,
      orderDate: new Date(),
      orderNumber: orderNumber,
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
