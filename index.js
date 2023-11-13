import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
  update,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://realtime-database-7acf7-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");
const messageInDB = ref(database, "message");

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");
const messageEl = document.getElementById("message");
const deleteBtn = document.getElementById("delete-btn");
// const selectedItems = {};
function checkInput() {
  if (inputFieldEl.value.trim().split(" ").length > 2) {
    addButtonEl.innerText = "Send message 💬";
    addButtonEl.style.color = "#4895ef";
    addButtonEl.style.textShadow = "1px 1px 2px white";
  } else {
    addButtonEl.innerText = "Add to cart";
    addButtonEl.style.color = "white";
    addButtonEl.style.textShadow = "1px 1px 2px #809bff";
  }
}

inputFieldEl.addEventListener("input", checkInput);

addButtonEl.addEventListener("click", function () {
  let inputValue = inputFieldEl.value;

  // новий елемент з selected
  if (inputValue) {
    const inputLength = inputValue.split(" ").length;

    if (inputLength > 2) {
      const newMessage = {
        value: inputValue,
        isLiked: false,
        createdAt: serverTimestamp(),
      };

      push(messageInDB, newMessage);
    } else {
      const newItem = {
        value: inputValue,
        selected: false, // По замовчуванню, елемент не виділений
      };

      push(shoppingListInDB, newItem);
    }

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

onValue(messageInDB, function (snapshot) {
  if (snapshot.exists()) {
    messageEl.style.display = "flex";
    let itemsArray = Object.entries(snapshot.val());
    clearListEl(messageEl);
    // console.log(itemsArray)

    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i];

      appendItemToMessageEl(currentItem[0], currentItem[1]);
    }
  } else {
    messageEl.style.display = "none";
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

function appendItemToMessageEl(currentItemID, currentItemObj) {
  let itemID = currentItemID;
  let itemObj = currentItemObj;

  const newLiEl = document.createElement("li");
  const messageTextContainer = document.createElement("div");
  const messageTextEl = document.createElement("h3");
  const dateMessageEl = document.createElement("p");
  const likeEl = document.createElement("i"); // помилка вкладена i елемент

  likeEl.className = `fa-solid fa-heart ${itemObj.isLiked ? "liked" : ""}`;
  likeEl.setAttribute("data-like", itemID);

  messageTextEl.textContent = itemObj.value;

  const nowTime = new Date(itemObj.createdAt);
  const optionsTime = { hour: "2-digit", minute: "2-digit" };
  const timeStringFormat = new Intl.DateTimeFormat("en-US", optionsTime).format(
    nowTime
  );
  dateMessageEl.textContent = timeStringFormat;

  messageTextContainer.append(messageTextEl, dateMessageEl);
  newLiEl.append(messageTextContainer, likeEl);
  messageEl.append(newLiEl);

  let exactLocationOfItemInDB = ref(database, `message/${itemID}`);

  newLiEl.addEventListener("dblclick", () => {
    remove(exactLocationOfItemInDB);
  });

  document.addEventListener("click", (e) => {
    if (e.target.dataset.like) {
      handleLikeClick(e.target.dataset.like, itemID, itemObj);
    }
  });
}

// liked
function handleLikeClick(messageId, itemID, itemObj) {
  if (messageId === itemID) {
    let exactLocationOfItemInDB = ref(database, `message/${itemID}`);
    itemObj.isLiked = !itemObj.isLiked;

    update(exactLocationOfItemInDB, { isLiked: itemObj.isLiked });
  }
}
