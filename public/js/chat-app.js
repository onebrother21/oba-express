const socket = io();
const inboxPeople = document.querySelector(".inbox__people");
const inputField = document.querySelector(".message_form__input");
const messageForm = document.querySelector(".message_form");
const messageBox = document.querySelector(".messages__history");
const fallback = document.querySelector(".fallback");

let user = {username:"",id:"",role:""};
const connectMe = () => {
  const username = prompt("Welcome. Please enter your name");
  const id = Math.floor(Math.random() * 1000000);
  user = {username,id,role:"USER"};
  socket.emit("user_connected",user);
  displayUsers(username);
};
const displayUsers = (username) => {
  if(!!document.querySelector(`.${username}-userlist`)){return;}
  const userBox = `<div class="chat_ib ${username}-userlist"><h5>${username}</h5></div>`;
  inboxPeople.innerHTML += userBox;
};
const displayMessage = ({username,message}) => {
  const time = new Date();
  const formattedTime = time.toLocaleString("en-US",{hour:"numeric",minute:"numeric"});
  const receivedMsg = `
    <div class="incoming__message">
      <div class="received__message">
        <p>${message}</p>
        <div class="message__info">
          <span class="message__author">${username}</span>
          <span class="time_date">${formattedTime}</span>
        </div>
      </div>
    </div>`;
  const myMsg = `
    <div class="outgoing__message">
      <div class="sent__message">
        <p>${message}</p>
        <div class="message__info">
          <span class="time_date">${formattedTime}</span>
        </div>
      </div>
    </div>`;
  messageBox.innerHTML += username === user.username?myMsg:receivedMsg;
};
const sendMessage = (ev) => {
  ev.preventDefault();
  if (!inputField.value) {return;}
  socket.emit("chat_message",{message:inputField.value,user});
  inputField.value = "";
};
const showIsTyping = () => socket.emit("typing",{isTyping:inputField.value.length>0,user});
messageForm.addEventListener("submit",sendMessage);
inputField.addEventListener("keyup",showIsTyping);

socket.on("connection",() => connectMe());
socket.on("disconnected",() => socket.emit("user_disconnected",user));
socket.on("user_connected",(users) => users.map((username) => displayUsers(username)));
socket.on("user_disconnected",(username) => document.querySelector(`.${username}-userlist`).remove());
socket.on("chat_message",({username,msg}) => displayMessage({user:username,message:msg}));
socket.on("typing",({username,isTyping}) => fallback.innerHTML = isTyping?`<p>${username} is typing...</p>`:"");