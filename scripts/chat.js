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

onValue(messageInDB, function (snapshot) {
  if (snapshot.exists()) {
    if (messageEl) {
      messageEl.style.display = "flex";
    }
    let itemsArray = Object.entries(snapshot.val());
    clearListEl(messageEl);
    console.log(itemsArray);

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

// RENDER
function appendItemToMessageEl(itemID, itemObj) {
  const newLiEl = document.createElement("li");
  const messageTextContainer = document.createElement("div");
  const messageTextEl = document.createElement("h3");
  const dateMessageEl = document.createElement("p");
  const likeEl = document.createElement("i");

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
  scrollToBottom();
  // scrollToBottomSmooth();
  // scrollToSmooth(chatList.scrollHeight, 500);

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

function scrollToBottom() {
  chatList.scrollTop = chatList.scrollHeight;
}

$('#messages_container').animate({scrollTop:$('#messages_container').prop('scrollHeight')}, 1000);