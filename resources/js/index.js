const nameInput = document.getElementById("my-name-input");
const myMessage = document.getElementById("my-message");
const sendButton = document.getElementById("send-button");
const saveButton = document.getElementById("save-button")
const chatBox = document.getElementById("chat");
const serverURL = `https://it3049c-chat-application.herokuapp.com/messages`;
const username = nameInput.value;

//Load username from storage
nameInput.value = localStorage.getItem("username");
//Check if username is blank after loading
checkUsername();


const MILLISECONDS_IN_TEN_SECONDS = 10000;
setInterval(updateMessagesInChatBox, MILLISECONDS_IN_TEN_SECONDS);

async function updateMessagesInChatBox(){
  const messages = await fetchMessages();
  let formattedMessages = "";
    messages.forEach(message => {
        formattedMessages += formatMessage(message, nameInput.value);
    });
    chatBox.innerHTML = formattedMessages;

}

function fetchMessages() {
    return fetch(serverURL)
        .then( response => response.json())
}

updateMessagesInChatBox();

function formatMessage(message, myNameInput) {
  const time = new Date(message.timestamp);
  const formattedTime = `${time.getHours()}:${time.getMinutes()}`;
  console.log(formattedTime);

  if (myNameInput === message.sender) {
      return `
      <div class="mine messages">
          <div class="message">
              ${message.text}
          </div>
          <div class="sender-info">
              ${formattedTime}
          </div>
      </div>
      `
  } else {
      return `
          <div class="yours messages">
              <div class="message">
                  ${message.text}
              </div>
              <div class="sender-info">
                  ${message.sender} ${formattedTime}
              </div>
          </div>
      `
  }
}

//Send messages to the server
function sendMessages(username, text) {
  const newMessage = { //Create a newMessage object with the necessary information defined when you call the function
      sender: username,
      text: text,
      timestamp: new Date()
  }

  fetch (serverURL, {
      method: `POST`, 
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(newMessage) //convert the message object to JSON
  });
}

sendButton.addEventListener("click", function(sendButtonClickEvent) {
  sendButtonClickEvent.preventDefault();
  const sender = nameInput.value;
  const message = myMessage.value;

  sendMessages(sender,message);
  myMessage.value = "";
});

function disableMessage() {
    myMessage.setAttribute("disabled", true);
}

function enableMessage(){
    if(myMessage.hasAttribute("disabled")){
        myMessage.removeAttribute("disabled");
    }
}

function saveUsername() {
    localStorage.setItem("username", nameInput.value)
}

function checkUsername() {
    if(!nameInput.value){
        disableMessage();
    }
    else{
        enableMessage();
    }
}

nameInput.addEventListener("input", function(){
    checkUsername();
});


saveButton.addEventListener("click", function(saveButtonClickEvent) {
    saveButtonClickEvent.preventDefault();
    saveUsername();
  });
