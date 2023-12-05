// ACTIVE LINK

const currentPath = window.location.pathname;
console.log(currentPath)
const links = document.querySelectorAll(".nav__link");

links.forEach((link) => {
  if (link.getAttribute("href") === currentPath) {
    link.classList.add("active");
  }
});

// CHANGE BUTTON FUNCTION

// function checkInput() {
//   if (inputFieldEl.value.trim().split(" ").length > 2) {
//     addButtonEl.innerText = "Send message 💬";
//     addButtonEl.style.color = "#4895ef";
//     addButtonEl.style.textShadow = "1px 1px 2px white";
//   } else {
//     addButtonEl.innerText = "Add to cart";
//     addButtonEl.style.color = "white";
//     addButtonEl.style.textShadow = "1px 1px 2px #809bff";
//   }
// }

// inputFieldEl.addEventListener("input", checkInput);