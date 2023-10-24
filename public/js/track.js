document
  .querySelector("#trackSubmit")
  .addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the default behavior of the click event
    const trackingNumber = document.getElementById("tracking-number").value;
    if (trackingNumber && trackingNumber.length >= 4) {
      document.getElementById("tracking-error").innerHTML = ""

      window.location.href =
        "https://www.trackingmore.com/track/en/" + trackingNumber + "?express=cj-dropshipping";
    } else {
      document.getElementById("tracking-error").innerHTML = "Tracking number must be at leatest 4 symbols"
    }
  });
// document
//   .querySelector("#orderIdButton")
//   .addEventListener("click", function (event) {
//     event.preventDefault();
//     const orderNumber = document.getElementById("orderNumber").value;
//     fetch("/get-order", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ orderNumber }),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         let orderStatus = data.orderStatus;
//         let remark = "";

//         switch (orderStatus) {
//           case "CREATED":
//             remark = "create order, wait confirm";
//             break;
//           case "IN_CART":
//             remark = "wait confirm, api merge this state";
//             break;
//           case "UNPAID":
//             remark = "confirm order, cj order number create";
//             break;
//           case "UNSHIPPED":
//             remark = "paid, wait for sending";
//             break;
//           case "SHIPPED":
//             remark = "in transit, get tracking number";
//             break;
//           case "DELIVERED":
//             remark = "clients receiving";
//             break;
//           case "CANCELLED":
//             remark = "";
//             break;
//           default:
//             remark = "unknown status";
//         }

//         // Now 'remark' contains the appropriate remark based on 'orderStatus'
//         console.log("Remark:", remark);
//         let trackNumber = data.trackNumber;
//         console.log(trackNumber)
//         if(trackNumber === null) {
//           console.log(true)
//           trackNumber = "tracking number not available yet"
//         }
//         document.getElementById("result").style.display = "flex"
//         document.getElementById("result").innerHTML =
//           `<p>Order status: <span class="order_status">${remark}</span></p>` +
//           `<p>Tracking number: <span class="track_status">${trackNumber}</span></p>`;
//       });
//   });
