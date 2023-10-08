const savedSearchQuestion = localStorage.getItem("searchQuestion");

const searchInputs = document.querySelectorAll(".nav_search");

searchInputs.forEach((input) => {
  // Do something with each search input, e.g., set its value
  const searchQuestion = savedSearchQuestion || input.value;

  input.value = savedSearchQuestion;
  localStorage.setItem("searchQuestion", searchQuestion);
});
function productsLogic() {
  if (window.location.pathname === "/catalog") {
    const allProductTitles = document.querySelectorAll(".search_product_title");
    const savedSearchQuestion3 = localStorage.getItem("searchQuestion");

    allProductTitles.forEach((title) => {
      if (
        title.innerHTML
          .toLocaleLowerCase()
          .includes(`${savedSearchQuestion3.toLocaleLowerCase()}`)
      ) {
        title.parentElement.style.display = "flex";
      } else {
        title.parentElement.style.display = "none";
      }
    });
  }
}
productsLogic();
function searchProduct(inputElement) {
  const something = inputElement.value;
  console.log(something);
  const searchQuestionOfInput = inputElement.value;
  localStorage.setItem("searchQuestion", searchQuestionOfInput);
  searchInputs.forEach((input) => {
    const savedSearchQuestion2 = localStorage.getItem("searchQuestion");
    input.value = savedSearchQuestion2;
  });
  productsLogic();
  if (window.location.pathname === "/") {
    window.location = "/catalog";
  }
}

