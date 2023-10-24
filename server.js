//? Initialization of packages

const express = require("express");
const app = express();
const fs = require("fs");
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
app.get("/room-cooking-pot", (req, res) => {
  res.sendFile(path.join(`${staticPath}/products`, "pot.html"));
});
app.get("/unsubscribe", (req, res) => {
  res.sendFile(path.join(staticPath, "unsubscribe.html"));
});
app.get("/checkout", (req, res) => {
  res.sendFile(path.join(staticPath, "checkout.html"));
});
app.get("/contact", (req, res) => {
  res.sendFile(path.join(staticPath, "contact.html"));
});
app.get("/track", (req, res) => {
  res.sendFile(path.join(staticPath, "track.html"));
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
              from: `${process.env.EMAIL_ACCOUNT} <${process.env.EMAIL_ACCOUNT}>`,
              to: recipientEmail,
              subject: title,
              replyTo: `${process.env.EMAIL_ACCOUNT}`,
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
                    from: `${process.env.EMAIL_ACCOUNT}`,
                    to: email,
                    subject: "Welcome email",
                    replyTo: `${process.env.EMAIL_ACCOUNT}`,
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

// Create a function to send an email
const sendEmail = async (formData) => {
  const mailOptions = {
    from: formData.emailAddress,
    to: `${process.env.EMAIL_ACCOUNT}`, // Replace with the email address you want to receive the emails
    subject: `${formData.emailAddress}: ${formData.subject}`,
    text: `${formData.emailAddress}: ${formData.message}`,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

// Create a route to handle the contact form submission
const contactFormRoute = async (req, res) => {
  // Get the form data
  const formData = req.body;
  // Send the email
  await sendEmail(formData);

  // Send a success response
  res.status(200).send({ message: "Email sent successfully!" });
};

// Add the contact form route to your Express app
app.post("/contact-form", contactFormRoute);

//? Payments
app.post("/check-coupon", (req, res) => {
  const code = req.body.code;

  let couponCode = `${process.env.COUPON}`;
  if (code === couponCode) {
    res.status(200).send();
  } else {
    res.status(400).send();
  }
});
app.post("/create-order", (req, res) => {
  const OrderDate = req.body.OrderDate;
  const OrderEmail = req.body.OrderEmail;
  const FirstName = req.body.FirstName;
  const LastName = req.body.LastName;
  const OrderCity = req.body.OrderCity;
  const OrderAddress = req.body.OrderAddress;
  const OrderZIP = req.body.OrderZip; // Correct the case
  const Total = req.body.Total;
  const OrderStatus = req.body.OrderStatus;
  const OrderTrackingNumber = req.body.OrderTrackingNumber;
  const OrderPhone = req.body.OrderPhone;
  const OrderProducts = req.body.OrderProducts;
  const OrderAddress2 = req.body.OrderAddress2;
  const OrderProvince = req.body.OrderProvince;
  // Create a Date object from the input string
  const date = new Date(OrderDate);

  // Extract the components of the date
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1; // Months are zero-indexed, so add 1
  const day = date.getUTCDate();
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();

  // Format the date in the MySQL-friendly format
  const mysqlFriendlyDate = `${year}-${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")} ${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  console.log(
    mysqlFriendlyDate,
    OrderEmail,
    FirstName,
    LastName,
    OrderCity,
    OrderAddress,
    OrderZIP,
    Total,
    OrderStatus,
    OrderTrackingNumber,
    OrderPhone,
    OrderProducts,
    OrderAddress2,
    OrderProvince
  );

  const insertSql =
    "INSERT INTO orderscj (OrderDate, OrderEmail, FirstName, LastName, OrderCity, OrderAddress, OrderZIP, Total, OrderStatus, OrderTrackingNumber, OrderPhone, OrderProducts, OrderAddress2, OrderProvince) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [
    mysqlFriendlyDate,
    OrderEmail,
    FirstName,
    LastName,
    OrderCity,
    OrderAddress,
    OrderZIP,
    Total,
    OrderStatus,
    OrderTrackingNumber,
    OrderPhone,
    OrderProducts,
    OrderAddress2,
    OrderProvince
  ];

  db.query(insertSql, values, (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      res.status(500).send("Error inserting data");
    } else {
      console.log("Data inserted successfully");
      res.status(200).send("Data inserted successfully");
    }
  });
});

app.post("/check-address", async (req, res) => {
  const city = req.body.city;
  const address = req.body.address;

  const zip = req.body.zip;
  const code = req.body.state;

  console.log(address);
  let addressXML =
    '<AddressValidateRequest USERID="1PREPP5N11673"><Revision>1</Revision><Address><Address1></Address1><Address2>' +
    address +
    "</Address2><City>" +
    city +
    "</City><State>" +
    code +
    "</State><Zip5>" +
    zip +
    "</Zip5><Zip4></Zip4></Address></AddressValidateRequest>";

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

app.post("/send-success", (req, res) => {
  // Define the email data.
  const orderNumber = req.body.orderNumber;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const orderAddress = req.body.address;
  const total = req.body.total;
  const orderDate = req.body.orderDate;
  console.log(firstName, orderNumber, orderAddress, total, orderDate);
  const dayMinInit = new Date();

  const futureMinDate = new Date(dayMinInit);
  futureMinDate.setDate(dayMinInit.getDate() + 8);
  const futureMinDay = futureMinDate.getDate();
  const futureMinMonth = futureMinDate.getMonth() + 1;
  const futureMinYear = futureMinDate.getFullYear();

  const futureDate = new Date(dayMinInit);
  futureDate.setDate(dayMinInit.getDate() + 15);
  const futureDay = futureDate.getDate();
  const futureMonth = futureDate.getMonth() + 1;
  const futureYear = futureDate.getFullYear();

  // Your email template
  const emailTemplate = `
<!DOCTYPE html>
<html>
  <head>
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@200;400;600&display=swap");
      .button {
        background-color: #000;
        color: #fff;
        padding: 12px 24px;
        text-decoration: none;
        font-family: 'Montserrat', sans-serif;
        cursor: pointer;
      }
      p {
        font-size: 16px;
        font-family: 'Montserrat', sans-serif;
        color: #000000;
      }
      html {
        max-width: 700px;
        font-family: 'Montserrat', sans-serif;
      }
    </style>
  </head>
  <body>
    <p style="font-size: 24px; font-weight: bold">
      Arriving between ${futureMinDay}/${futureMinMonth}/${futureMinYear} and ${futureDay}/${futureMonth}/${futureYear}
    </p>

    <p style=" font-weight: bold">Hi ${firstName},</p>

    <p>We received your order and it will be proceeded within 24 hours</p>

<p >Your Total: <span style="font-weight: bold">$${total}</span></p>
<p style="font-size: 12px;">Below you can find address which you wrote, contact us if it isn't right</p>

    <div style="float: left; width: 50%">
      <p style="font-weight: bold">Delivery address</p>
      <p>${firstName} ${lastName}</p>
      <p>${orderAddress}</p>
    </div>

    <div style="float: right; width: 50%">
      <p style="font-weight: bold">Estimated delivery</p>
      <p>between ${futureMinDay}/${futureMinMonth}/${futureMinYear} and ${futureDay}/${futureMonth}/${futureYear}</p>
    </div>
  </body>
</html>
`;
  // Email data
  const mailOptions = {
    from: `${process.env.EMAIL_ACCOUNT}`,
    to: "ilahristoforov88@gmail.com",
    subject: `Thanks for your order`,
    html: emailTemplate,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
});

//? Start Server
// Attempt to get a connection from the pool and check the status
app.post("/check-connection", (req, res) => {
  db.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      res.status(500).send()
    }
  
    console.log('Connected to MySQL');
    res.status(200).send()
  
    // Release the connection back to the pool when you're done with it.
    connection.release();
  });
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
