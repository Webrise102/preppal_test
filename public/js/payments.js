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
      alert("Payment Failed, try reloading page or contact our support");
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
      displayPaymentResults("SUCCESS");
      console.debug("Payment Success", paymentResults);
    } catch (e) {
      cardButton.disabled = false;
      displayPaymentResults("FAILURE");
      console.error(e.message);
    }
  }

  const cardButton = document.getElementById("card-button");
  cardButton.addEventListener("click", async function (event) {
    await handlePaymentMethodSubmission(event, card);
  });
});
function showLoader() {
  const loader = document.getElementById("loader");
  loader.style.display = "block";
}
function hideLoader() {
  const loader = document.getElementById("loader");
  loader.style.display = "none";
}
