const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')

//Get username and room from URL
const {username, room}  = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

console.log(username, room)

const socket = io()

//Join chatroom
socket.emit('joinRoom', {username, room})

//get room and users
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room)
    outputUsers(users)
})

socket.on('message', message => {
    console.log(message)

    //Scroll down to new message
    
    outputMessage(message);
    chatMessages.scrollTop = chatMessages.scrollHeight + 500;

  

})

//Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const msg = e.target.elements.msg.value;

    socket.emit('chatMessage', msg);
    e.target.elements.msg.value=''
    e.target.elements.msg.focus()
    console.log(msg)
})

function outputMessage(message) {
    console.log(message)
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `
    <div class="avatar">
    <img src="./assets/images/avatar.png" alt="">
    </div>
     <div class="message-area">
     <p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>
    </div>
    `
    document.querySelector('.chat-messages').appendChild(div);
}

//Add room name to DOM
function outputRoomName(room) {
   roomName.innerText = room 
}

//Add users to DOM
function outputUsers(users) {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `
}
