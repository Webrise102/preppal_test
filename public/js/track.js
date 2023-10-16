document
  .querySelector("#trackSubmit")
  .addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the default behavior of the click event
    const trackingNumber = document.getElementById("tracking-number").value;
    if (trackingNumber) {
      window.location.href =
        "https://cjpacket.com/?trackingNumber=" + trackingNumber;
    }
  });
