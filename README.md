# preppal
# Email template
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
      Arriving between 24/10/23 and 26/10/23
    </p>

    <p style=" font-weight: bold">Hi ${firstName},</p>

    <p>Your parcel is packed and on its way!</p>
    <a href="localhost:3000/track" class="button">Track your parcel</a>

    <p style="color: grey; font-size: 12px;font-weight: 200">
      Tracking not available? Sometimes it can take up to 24 hours, so check
      again in a little while.
    </p>

    <div style="float: left; width: 50%">
      <p style="font-weight: bold">Delivery address</p>
      <p>${firstName} ${lastName}</p>
      <p>${orderAddress}</p>
    </div>

    <div style="float: right; width: 50%">
      <p style="font-weight: bold">Estimated delivery</p>
      <p>between 24/10/23 and 26/10/23</p>
    </div>
  </body>
</html>
