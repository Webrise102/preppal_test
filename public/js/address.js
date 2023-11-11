function validate() {
  const address = document.getElementById("address").value
  fetch("/check-address", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({address: address})
  })
    .then((response) => response.json())
    .then((data) => {
        console.log(data.data)
    })
    .catch((error) => {
      console.log(error);
    });
}
