const appId = "sandbox-sq0idb-7ZiozI0Lm8Ltn7rmq5INaQ";
const locationId = "LEG1KX336TMA8";
const darkModeCardStyle = {
  ".input-container": {
    borderColor: "#2D2D2D",
    borderRadius: "6px",
  },
  ".input-container.is-focus": {
    borderColor: "#006AFF",
  },
  ".input-container.is-error": {
    borderColor: "#ff1600",
  },
  ".message-text": {
    color: "#999999",
  },
  ".message-icon": {
    color: "#999999",
  },
  ".message-text.is-error": {
    color: "#ff1600",
  },
  ".message-icon.is-error": {
    color: "#ff1600",
  },
  input: {
    backgroundColor: "#2D2D2D",
    color: "#FFFFFF",
    fontFamily: "helvetica neue, sans-serif",
  },
  "input::placeholder": {
    color: "#999999",
  },
  "input.is-error": {
    color: "#ff1600",
  },
};
// Function to generate a random idempotency key
function generateRandomString(length) {
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const allCharacters = symbols + characters;
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allCharacters.length);
    result += allCharacters.charAt(randomIndex);
  }

  return result;
}

const idempotencyKey = generateRandomString(10);

async function initializeCard(payments) {
  showLoader();

  const card = await payments.card({
    style: darkModeCardStyle,
  });
  await card.attach("#card-container");
  hideLoader();

  return card;
}

async function createPayment(token) {
  showLoader();

  const body = JSON.stringify({
    locationId,
    sourceId: "cnon:card-nonce-ok",
    idempotencyKey,
    amount: sum,
  });
  try {
    const paymentResponse = await fetch("/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });

    if (paymentResponse.ok) {
      hideLoader();

      return paymentResponse.json();
    } else {
      hideLoader();
      window.scrollTo({ top: 0, behavior: "instant" });

      document.getElementById("container").style.display = "block";
      document.getElementById("container").style.boxShadow =
        "0px 0px 50px 500px rgba(0,0,0,0.89)";
      document.querySelector(".error-box1").style.display = "block";
      document.querySelector(".error-box1").style.boxShadow =
        "0px 0px 50px 5000px rgba(0,0,0,0.89)";
      document.body.style.overflow = "hidden";
      console.log("Error");
    }
  } catch (error) {
    console.error(error);
  }
}

async function tokenize(paymentMethod) {
  const tokenResult = await paymentMethod.tokenize();
  if (tokenResult.status === "OK") {
    return tokenResult.token;
  } else {
    let errorMessage = `Tokenization failed-status: ${tokenResult.status}`;
    if (tokenResult.errors) {
      errorMessage += ` and errors: ${JSON.stringify(tokenResult.errors)}`;
    }
    throw new Error(errorMessage);
  }
}

function displayPaymentResults(status) {
  const statusContainer = document.getElementById("payment-status-container");
  if (status === "SUCCESS") {
    statusContainer.classList.remove("is-failure");
    statusContainer.classList.add("is-success");
  } else {
    statusContainer.classList.remove("is-success");
    statusContainer.classList.add("is-failure");
  }
  statusContainer.style.visibility = "visible";
}

document.addEventListener("DOMContentLoaded", async function () {
  if (!window.Square) {
    throw new Error("Square.js failed to load properly");
  }

  const payments = window.Square.payments(appId, locationId);
  let card;
  try {
    card = await initializeCard(payments);
  } catch (e) {
    console.error("Initializing Card failed", e);
    return;
  }

  async function handlePaymentMethodSubmission(event, paymentMethod) {
    event.preventDefault();
    try {
      const cardButton = document.getElementById("card-button");
      // Disable the submit button as we await tokenization and make a payment request.
      cardButton.disabled = true;
      const token = await tokenize(paymentMethod);
      const paymentResults = await createPayment(token);
      if (paymentResults) {
        displayPaymentResults("SUCCESS");
        console.debug("Payment Success", paymentResults);
        storeOrder(); // Call the storeOrder function after successful payment
      }
    } catch (e) {
      cardButton.disabled = false;

      displayPaymentResults("FAILURE");
      console.error(e.message);

      return false;
    }
  }

  const cardButton = document.getElementById("card-button");
  cardButton.addEventListener("click", async function (event) {
    console.log("Called Function");
    event.preventDefault();
    const orderNumber = Array.from({ length: 10 }, () =>
      Math.floor(Math.random() * 10)
    ).join("");

    const shippingZip = document.getElementById("zip").value;
    const shippingProvince = document.getElementById("province").value;
    const shippingCity = document.getElementById("city").value;
    const shippingAddress = document.getElementById("address").value;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const shippingPhone = document.getElementById("phone").value;
    const houseNumber = document.getElementById("house").value;
    const orderEmail = document.getElementById("email").value;

    let addressError = "";
    let stateError = "";
    let phoneError = "";
    let nameError = "";
    let houseError = "";
    let emailError = "";

    if (firstName === "" || lastName === "") {
      nameError = "Please fill in all name fields.";
    }
    document.querySelector(".nameError").innerHTML = nameError;
    if (houseNumber === "") {
      houseError = "Please fill in house number field";
    }
    document.querySelector(".houseError").innerHTML = houseError;
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(orderEmail)) {
    } else {
      emailError = "Invalid Email Address";
    }
    document.querySelector(".errorEmail").innerHTML = emailError;


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

    function getStateCode(stateName) {
      const normalizedStateName = stateName.trim();
      return stateCodes[normalizedStateName] || false;
    }

    const stateName = `${shippingProvince.toLowerCase()}`;
    const stateCode = getStateCode(stateName);

    if (stateCode === false) {
      stateError = "State Not Found";
    }

    function isValidPhoneNumber(phoneNumber) {
      const phonePattern =
        /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9][0-9]{2})\s*\)|([2-9][0-9]{2}))(?:[.-]\s*)?([2-9][0-9]{2})(?:[.-]\s*)?([0-9]{4}))(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/;
      return phonePattern.test(phoneNumber);
    }

    const phoneNumber = `${shippingPhone}`;
    if (!isValidPhoneNumber(phoneNumber)) {
      phoneError = "Phone Is Incorrect";
    }

    // Display errors for each field
    document.querySelector(".errorAddress").innerHTML = addressError;
    document.querySelector(".errorState").innerHTML = stateError;
    document.querySelector(".errorPhone").innerHTML = phoneError;

    console.log("Success");

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
        console.log(response);
        if (response.status === 400) {
          document.querySelector(".errorAddress").innerHTML =
            "Address/City Incorrect";
        }
        if (response.status === 200) {
          document.querySelector(".errorAddress").innerHTML = "";
          fetch("/check-access", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(serverData),
          })
            .then((response) => {
              console.log(response);
              if (response.status === 400) {
                window.scrollTo({ top: 0, behavior: "instant" });

                document.getElementById("container").style.display = "block";
                document.getElementById("container").style.boxShadow =
                  "0px 0px 50px 500px rgba(0,0,0,0.89)";
                document.querySelector(".error-box2").style.display = "block";
                document.querySelector(".error-box2").style.boxShadow =
                  "0px 0px 50px 5000px rgba(0,0,0,0.89)";
                document.body.style.overflow = "hidden";
              }
              if (response.status === 200) {
                handlePaymentMethodSubmission(event, card);
              }
            })
            .catch((error) => {
              document.querySelector(".errorAddress").innerHTML =
                "Address/City Incorrect";
            });
        }
      })
      .catch((error) => {
        document.querySelector(".errorAddress").innerHTML =
          "Address/City Incorrect";
      });
  });
  function storeOrder() {
    const orderNumber = Array.from({ length: 10 }, () =>
      Math.floor(Math.random() * 10)
    ).join("");
    const shippingZip = document.getElementById("zip").value;
    const shippingProvince = document.getElementById("province").value;
    const shippingCity = document.getElementById("city").value;
    const shippingAddress = document.getElementById("address").value;
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const shippingPhone = document.getElementById("phone").value;
    const houseNumber = document.getElementById("house").value;
    const productses = [];

    // Loop through the cart items and create a new object for each product
    console.log(cartData);
    for (const key in cartData) {
      const product = {
        vid: cartData[key].productVid,
        quantity: cartData[key].productAmount,
        shippingName: "",
      };
      productses.push(product);
      console.log(product)
    }
    const orderData = {
      orderNumber: `${orderNumber}`,
      shippingZip: `${shippingZip}`,
      shippingCountryCode: "US",
      shippingCountry: "United States",
      shippingProvince: `${shippingProvince}`,
      shippingCity: `${shippingCity}`,
      shippingAddress: `${shippingAddress}`,
      shippingCustomerName: `${firstName} ${lastName}`,
      shippingPhone: `${shippingPhone}`,
      remark: "note",
      fromCountryCode: "US",
      logisticName: "US (2-5Days)",
      houseNumber: `${houseNumber}`,
      email: "",
      products: productses,
    };
    console.log(orderData.products)

    // Now you can use the `products` array in your code
    console.log(productses);
    fetch("/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderData }),
    });
    fetch("/send-success", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderNumber: orderNumber, firstName: firstName, lastName: lastName, address:shippingCity + " " + shippingAddress + " " + shippingZip, total: sum, orderDate: new(Date) }),
    })
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
});
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
