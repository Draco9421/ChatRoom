const socket = io(); 
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages'); 

const{ username , room} = Qs.parse(location.search,{
  ignoreQueryPrefix:true
})

// Output msg
socket.on('message',message => {
  outputmessage(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Joined Chat
socket.emit('joinRoom',{username , room});

socket.on('roomUsers',({roomused,users}) =>{
  roomName(roomused);
  UserList(users);
});

//Message event listner
chatForm.addEventListener('submit',(e) => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;
  e.target.elements.msg.value =  "";
  //sending data to server
  socket.emit('ChatMessage',msg);
});


//adding msg to the html 
function outputmessage(message){
  const div = document.createElement('div');
  div.classList.add('message');
  
  div.innerHTML = `<p class ="meta"> ${message.username} <span> ${message.time} </span></p>
  <p class=""text>
    ${message.text}
  </p>`;

  document.querySelector('.chat-messages').appendChild(div);

};

function roomName(roomused){
  document.getElementById("room-name").innerText = roomused; 
};

function UserList(users){
  document.getElementById('users').innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`;
}