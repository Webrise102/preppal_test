//? Initialization of packages

const express = require("express");
const app = express();
const path = require("path");
const dotenv = require("dotenv");
const crypto = require("crypto");
require("dotenv").config();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const schedule = require("node-schedule");
const nodemailer = require("nodemailer");
const square = require("square");
const axios = require("axios");

const accessToken = `${process.env.ACCESS_TOKEN}`;
const environment = square.Environment.Sandbox; // or square.Environment.Production
const client = new square.Client({
  accessToken: accessToken,
  environment: environment,
});

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  service: "Gmail",

  auth: {
    user: process.env.EMAIL_ACCOUNT,
    pass: process.env.EMAIL_PASSWORD,
  },
});

//? Routes

app.use(express.static("public"));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

let staticPath = path.join(__dirname, "public");

app.get("/", (req, res) => {
  res.sendFile(path.join(staticPath, "index.html"));
});
app.get("/catalog", (req, res) => {
  res.sendFile(path.join(staticPath, "catalog.html"));
});
app.get("/fast-defrost-tray", (req, res) => {
  res.sendFile(path.join(`${staticPath}/products`, "tray.html"));
});
app.get("/mini-electric-juicer", (req, res) => {
  res.sendFile(path.join(`${staticPath}/products`, "juicer.html"));
});
app.get("/unsubscribe", (req, res) => {
  res.sendFile(path.join(staticPath, "unsubscribe.html"));
});
app.get("/checkout", (req, res) => {
  res.sendFile(path.join(staticPath, "checkout.html"));
});

//? Subscription Service

//? Subscription Service

const mailer = async function (title, obj) {
  try {
    const email = "Your static email text here"; // Replace with your static email text
    // const text = replaceHTML(email, obj);

    db.query("SELECT email FROM subscriptions2", (err, results) => {
      if (err) {
        console.error("MySQL query error:", err);
      } else {
        results.forEach((row) => {
          const recipientEmail = row.email;

          transporter.sendMail(
            {
              from: `${process.env.contactEmail} <${process.env.contactEmail}>`,
              to: recipientEmail,
              subject: title,
              replyTo: process.env.contactEmail,
              headers: {
                "Mime-Version": "1.0",
                "X-Priority": "3",
                "Content-type": "text/html; charset=iso-8859-1",
              },
              html: email, // Use the static email text here
            },
            (err) => {
              if (err) {
                console.error("Email sending error:", err);
              } else {
                console.log(
                  `Email sent to ${recipientEmail} at ${new Date().toISOString()}`
                );
              }
            }
          );
        });
      }
    });
  } catch (e) {
    console.error("Error reading email template:", e);
  }
};
// Subscription route
app.post("/subscribe/email", async (req, res) => {
  const email = req.body.email;
  db.getConnection((err, connection) => {
    if (err) {
      throw err;
    }
    // Check if the email exists in the database
    db.query(
      "SELECT * FROM subscriptions2 WHERE email = ?",
      [email],
      (err, results) => {
        if (err) {
          console.error("MySQL query error:", err);
          res
            .status(500)
            .json({ message: "Error saving your email", code: "02" });
        } else if (results.length === 0) {
          // Email doesn't exist, validate and add to the database
          if (validateEmail(email)) {
            db.query(
              "INSERT INTO subscriptions2 (email) VALUES (?)",
              [email],
              (err) => {
                if (err) {
                  console.error("MySQL query error:", err);
                  res
                    .status(500)
                    .json({ message: "Error saving your email", code: "02" });
                } else {
                  // Send the "hello" email immediately
                  transporter.sendMail({
                    from: `PrepPal`,
                    to: email,
                    subject: "Welcome email",
                    replyTo: `PrepPal`,
                    headers: {
                      "Mime-Version": "1.0",
                      "X-Priority": "3",
                      "Content-type": "text/html; charset=iso-8859-1",
                    },
                    html: `Welcome to our newsletter,
                You can unsubscribe by clicking here: <a href="http://localhost:3000/unsubscribe">Unsubscribe</a>`,
                  });

                  res
                    .status(200)
                    .json({ message: "User has subscribed", code: "03" });
                }
              }
            );
          } else {
            res.status(400).json({ message: "Not a valid email", code: "02" });
          }
        } else {
          res
            .status(201)
            .json({ message: "User Already Subscribed", code: "02" });
        }
      }
    );
  });
});
// Check if an email exists in the database
app.get("/subscribe/check/:email", (req, res) => {
  const email = req.params.email;

  // Perform a database query to check if the email exists
  db.query(
    "SELECT * FROM subscriptions2 WHERE email = ?",
    [email],
    (err, results) => {
      if (err) {
        console.error("MySQL query error:", err);
        res.status(500).json({ message: "Error checking email", code: "02" });
      } else {
        if (results.length === 0) {
          // Email doesn't exist, return a response indicating it's not found
          res.status(404).json({ message: "Email not found", code: "01" });
        } else {
          // Email exists, return a response indicating it's found
          res.status(200).json({ message: "Email found", code: "03" });
        }
      }
    }
  );
});

// Unsubscribe route
app.post("/unsubscribe", (req, res) => {
  const { email } = req.body;
  console.log(email);
  const query = "SELECT * FROM subscriptions2 WHERE email = ?";

  db.query(query, [email], (error, results) => {
    if (error) {
      console.error("Database error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length === 0) {
      // User not found in the database
      return res.status(422).json({ error: "User not found" });
    }

    // User found, handle the unsubscribe process
    // ...
    // Send a success response if necessary
    return res.status(200).json({ message: "Unsubscribe successful" });
  });

  // Check if the email exists in the database and delete the row
  const sql = "DELETE FROM subscriptions2 WHERE email = ?";
  db.query(sql, [email], (err, result) => {
    if (err) {
      console.error("Error unsubscribing:", err);
      res.status(500).send("Error unsubscribing.");
    } else if (result.affectedRows === 0) {
      // Email not found in the database
      res.status(404).send("Email not found in the database.");
    } else {
      res.send(`Unsubscribed email: ${email}`);
    }
  });
});

// Schedule the email sending job
schedule.scheduleJob("00 58 11 * * 3", () => {
  mailer("This is our Subscription Email", {
    content: "Hello, welcome to our email 👋",
  });
});

// Utility function to validate email
const validateEmail = (email) => {
  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email);
};

//? Payments
app.post("/check-coupon", (req, res) => {
  const code = req.body;

  let couponCode = "tiktok";
  let error = "Error applying coupon";
  if (code === couponCode) {
    res.json({ couponCode });
  } else {
    res.json({ error });
  }
});
const apiUrl = "https://developers.cjdropshipping.com/api2.0/v1/authentication";
const email = `${process.env.CJ_EMAIL}`;
const password = `${process.env.CJ_PASSWORD}`;

// Function to get an access token
async function getAccessToken() {
  try {
    const response = await axios.post(`${apiUrl}/getAccessToken`, {
      email,
      password,
    });

    if (response.data && response.data.code === 200 && response.data.result) {
      return response.data.data.accessToken;
    } else {
      console.error("Failed to get access token:", response.data.message);
      return null;
    }
  } catch (error) {
    console.error("Error while getting access token:", error.message);
    return null;
  }
}
const url =
  "https://developers.cjdropshipping.com/api2.0/v1/logistic/freightCalculate";

const headers = {
  "Content-Type": "application/json",
  "CJ-Access-Token": `${process.env.CJ_ACCESS_TOKEN}`, // Replace with your actual access token
};

const data = {
  startCountryCode: "US",
  endCountryCode: "US",
  products: [
    {
      quantity: 1,
      vid: "F616DF14-C0BF-4BDC-AE52-75664D36218D",
    },
  ],
};

axios
  .post(url, data, { headers })
  .then((response) => {})
  .catch((error) => {
    console.error(error);
  });

app.post("/create-order", async (req, res) => {
  const accessToken = await getAccessToken();

  if (accessToken) {
    console.log(accessToken);
  } else {
    res.status(500).json({ error: "Failed to obtain access token" });
  }
  const headers = {
    "CJ-Access-Token": `${process.env.CJ_ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  };

  const data = req.body.orderData;
  console.log(data);

  const config = {
    method: "post",
    url: "https://developers.cjdropshipping.com/api2.0/v1/shopping/order/createOrder",
    headers,
    data,
  };
  createOrder(config);

  function createOrder(config) {
    axios(config)
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  }
});
app.post("/payment", async (req, res) => {
  console.log(true);
  const { locationId, sourceId, idempotencyKey } = req.body;

  try {
    const response = await client.paymentsApi.createPayment({
      sourceId,
      idempotencyKey,
      amountMoney: {
        amount: 10,
        currency: "USD",
      },
    });

    console.log(response.result);
  } catch (error) {
    console.log(error);
  }
});

app.post("/check-address", async (req, res) => {
  const city = req.body.city;
  const address = req.body.address;

  const zip = req.body.zip;
  const code = req.body.state

  console.log(address)
  let addressXML =
    '<AddressValidateRequest USERID="1PREPP5N11673"><Revision>1</Revision><Address><Address1></Address1><Address2>'+ address  +'</Address2><City>'+ city +'</City><State>'+ code +'</State><Zip5>'+ zip +'</Zip5><Zip4></Zip4></Address></AddressValidateRequest>';

  let addressUrl =
    "https://secure.shippingapis.com/ShippingAPI.dll?API=Verify&xml=" +
    encodeURIComponent(addressXML);
  console.log("Request");
  axios
    .get(addressUrl)
    .then(function (response) {
      console.log(response.data);
      if (response.data.includes("<Error>")) {
        res.status(400).send();
      } else {
        console.log("Error Not Found");
        res.status(200).send();
      }
    })
    .catch(function (error) {
      res.status(500).send();
    });
});

//? Start Server

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
