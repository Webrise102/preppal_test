const form = document.querySelector("#contact-form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const subjectInput = document.getElementById("subject");
  const messageTextarea = document.getElementById("message");

  const nameErrorMessage = document.querySelector("#namee");
  const emailErrorMessage = document.querySelector("#emaile");
  const subjectErrorMessage = document.querySelector("#subjecte");
  const messageErrorMessage = document.querySelector("#messagee");
  let contactNameError = "";
  let contactEmailError = "";
  let contactSubjectError = "";
  let contactMessageError = "";
  function countWords(str) {
    const arr = str.split(" ");
    console.log(arr)
    const filtered = arr.filter((word) => word !== "");
    console.log(filtered)
    return filtered.length;
  }
  // Validate the form
  if (nameInput.value.length < 2) {
    contactNameError = "Name must be at leatest 2 letters";
    nameErrorMessage.classList.add("unhidden")

  } else {
    contactNameError = "";
    nameErrorMessage.classList.remove("unhidden")

  }

  if (!emailInput.value.match(/^\S+\@[\S]+\.\S+$/)) {
    contactEmailError = "Email must be real";
    emailErrorMessage.classList.add("unhidden")

  } else {
    contactEmailError = "";
    emailErrorMessage.classList.remove("unhidden")

  }

  if (subjectInput.value.length < 3) {
    contactSubjectError = "Subject must be at leatest 3 letters";
    subjectErrorMessage.classList.add("unhidden")

  } else {
    contactSubjectError = "";
    subjectErrorMessage.classList.remove("unhidden")

  }

  if (countWords(messageTextarea.value) < 5) {
    contactMessageError = "Message must have at leatest 5 words";
    messageErrorMessage.classList.add("unhidden")

  } else {
    contactMessageError = "";
    messageErrorMessage.classList.remove("unhidden")

  }
  nameErrorMessage.innerHTML = `${contactNameError}`
  emailErrorMessage.innerHTML = `${contactEmailError}`
  subjectErrorMessage.innerHTML = `${contactSubjectError}`
  messageErrorMessage.innerHTML = `${contactMessageError}`


  // Hide all error messages
  nameErrorMessage.classList.add("hidden");
  emailErrorMessage.classList.add("hidden");
  subjectErrorMessage.classList.add("hidden");
  messageErrorMessage.classList.add("hidden");
  if (
    contactNameError === "" &&
    contactEmailError === "" &&
    contactSubjectError === "" &&
    contactMessageError === ""
  ) {
    // Send the form data to the backend
    const response = await fetch("/contact-form", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: nameInput.value,
        emailAddress: emailInput.value,
        subject: subjectInput.value,
        message: messageTextarea.value,
      }),
    });

    // Handle the response
    if (response.status === 200) {
      // Success!
      document.querySelector(".form_label").innerHTML = "Email sent successfully"
      document.querySelector(".form_label").style.color = "#40d44f"

      form.reset();
    } else {
      document.querySelector(".form_label").innerHTML = "Email wasnt sent, try reloading page"
      document.querySelector(".form_label").style.color = "#d44040"


    }
  }
});
