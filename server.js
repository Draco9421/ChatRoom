const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin , getCurrentUser , userLeave , getRoomUsers} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const bot =  "ChatRoom Bot";

//Setting static folder
app.use(express.static(path.join(__dirname,'public')));

//Run when client connects
io.on('connection', socket => {

    //finding user
    socket.on('joinRoom',({username,room}) => {
        const user = userJoin(socket.id ,username,room);
        
        socket.join(user.room);


        //getting the number of users and room name;
        io.to(user.room).emit('roomUsers',{
            roomused : user.room,
            users: getRoomUsers(user.room)
        });

        socket.emit('message', formatMessage(bot,"Welcome to the room"));
        
        socket.broadcast.to(user.room).emit('message', formatMessage(bot,`${user.username} has joined the chat`));
    })


    //Listing for a chat msg
    socket.on('ChatMessage',(msg) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message',formatMessage(user.username,msg));
    })

    

    socket.on('disconnect', () => { 
        const user = userLeave(socket.id);
        
        if(user){
            
            io.to(user.room).emit('message', formatMessage(bot,`${user.username} has left the chat`));
            io.to(user.room).emit('roomUsers',{
                roomused : user.room,
                users: getRoomUsers(user.room)
            });
        }

    });
});

const PORT = 5000 || process.env.PORT;

server.listen(PORT , () => console.log(`Server running on port ${PORT}`));