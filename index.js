import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://realtime-database-7acf7-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");
const deleteBtn = document.getElementById("delete-btn");
// const selectedItems = {};

addButtonEl.addEventListener("click", function () {
  let inputValue = inputFieldEl.value;
  // новий елемент з selected
  const newItem = {
    value: inputValue,
    selected: false, // По замовчуванню, елемент не виділений
  };

  push(shoppingListInDB, newItem);

  clearInputFieldEl();
});

function clearInputFieldEl() {
  inputFieldEl.value = "";
}

onValue(shoppingListInDB, function (snapshot) {
console.log(snapshot.val());
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val());
    clearShopingListEl();

    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i];

      appendItemToShoppingListEl(currentItem);
    }
  } else {
    shoppingListEl.innerText = "No items here...yet"
  }
});

function clearShopingListEl() {
  shoppingListEl.innerHTML = "";
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
  
  newLiEl.addEventListener("dblclick", () => {
    let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);

    remove(exactLocationOfItemInDB);
  });

  newLiEl.addEventListener("click", () => {
    newLiEl.classList.toggle("selected")

    if (newLiEl.classList.contains("selected")) {
      itemObj.selected = true;
    } else {
      itemObj.selected = false;
    }
  });

}

deleteBtn.addEventListener("click", () => {
    remove(shoppingListInDB);
  }
);
