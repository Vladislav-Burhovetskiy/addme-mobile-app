import {
  database,
  ref,
  push,
  onValue,
  remove,
  update,
  serverTimestamp,
} from "./firebase.js";

const messageInDB = ref(database, "message");

const messageInput = document.getElementById("chat__input");
const sendMessageBtn = document.getElementById("chat__send-btn");
const chatList = document.getElementById("chat__messages");
const messageEl = document.getElementById("chat__messages");
console.log(messageEl);

sendMessageBtn.addEventListener("click", function () {
  let inputValue = messageInput.value;

  if (inputValue) {
    const newMessage = {
      value: inputValue,
      isLiked: false,
      createdAt: serverTimestamp(),
    };

    push(messageInDB, newMessage);

    clearInputFieldEl();
  }
});

function clearInputFieldEl() {
  messageInput.value = "";
}

// onValue(shoppingListInDB, function (snapshot) {
//   if (snapshot.exists()) {
//     let itemsArray = Object.entries(snapshot.val());
//     clearListEl(chatList);

//     for (let i = 0; i < itemsArray.length; i++) {
//       let currentItem = itemsArray[i];

//       appendItemToShoppingListEl(currentItem);
//     }
//   } else {
//     chatList.innerText = "No items here...yet";
//   }
// });

onValue(messageInDB, function (snapshot) {
  if (snapshot.exists()) {
    if (messageEl) {
      messageEl.style.display = "flex";
    }
    let itemsArray = Object.entries(snapshot.val());
    clearListEl(messageEl);
    console.log(itemsArray)

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
  chatList.append(newLiEl);

  if (itemObj.selected) {
    newLiEl.classList.add("selected");
  }

  let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);

}

// RENDER

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

// LIKED
function handleLikeClick(messageId, itemID, itemObj) {
  if (messageId === itemID) {
    let exactLocationOfItemInDB = ref(database, `message/${itemID}`);
    itemObj.isLiked = !itemObj.isLiked;

    update(exactLocationOfItemInDB, { isLiked: itemObj.isLiked });
  }
}
