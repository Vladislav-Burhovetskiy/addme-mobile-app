import { database, ref, push, onValue, remove, update } from "./firebase.js";

const shoppingListInDB = ref(database, "shoppingList");

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");
const deleteBtn = document.getElementById("delete-btn");

addButtonEl.addEventListener("click", function () {
  let inputValue = inputFieldEl.value;

  if (inputValue) {
    const newItem = {
      value: inputValue,
      selected: false, // По замовчуванню, елемент не виділений
    };

    push(shoppingListInDB, newItem);
    clearInputFieldEl();
  }
});

function clearInputFieldEl() {
  inputFieldEl.value = "";
}

onValue(shoppingListInDB, function (snapshot) {
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val());
    clearListEl(shoppingListEl);

    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i];

      appendItemToShoppingListEl(currentItem);
    }
  } else {
    shoppingListEl.innerText = "No items here...yet";
  }
});

function clearListEl(element) {
  element.innerHTML = "";
}

function appendItemToShoppingListEl(item) {
  let itemID = item[0];
  let itemObj = item[1];

  const newLiEl = document.createElement("li");
  newLiEl.textContent = itemObj.value;
  shoppingListEl.append(newLiEl);

  if (itemObj.selected) {
    newLiEl.classList.add("selected");
  }

  let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);

  newLiEl.addEventListener("dblclick", () => {
    remove(exactLocationOfItemInDB);
  });

  newLiEl.addEventListener("click", () => {
    newLiEl.classList.toggle("selected");

    if (newLiEl.classList.contains("selected")) {
      update(exactLocationOfItemInDB, { selected: true });
    } else {
      update(exactLocationOfItemInDB, { selected: false });
    }
  });
}

deleteBtn.addEventListener("click", () => {
  remove(shoppingListInDB);
});
