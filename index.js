// Node server which will handle socket io connections
const io = require('socket.io')(3000)  // Node server which will handle socket io connections
// const cors = require('cors')
// const express = require('express')

const users = {};
// const index = express();

// index.use((req,res,next) =>{
//     res.header('Access-Control-Allow-Origin' , '*');
//     res.header('Access-Control-Allow-Header' ,'Origin, X-Requested-With ,Content-Type,Accept,Autherization');
//     if(req.method == 'Options'){
//         res.header('Access-Control-Allow-Origin' , 'PUT,POST,GET,DELETE,PATCH');
//         return res.status(200).json({});
//     }
// next();
//  });
// index.use(cors());

// var XMLHttpRequest = require('xhr2');
// var xhr = new XMLHttpRequest();


io.on('connection', socket => { // listens for incoming connections and executes a callback function when a new connection is established.
    // if any new user joins, let other users connected to the server know
    socket.on('new-user-joined', name => {
        // console.log("New user", name);
        users[socket.id] = name; // adds the name of the new user to the users object, using the socket.id as the key.
        socket.broadcast.emit('user-joined', name); // emits a 'user-joined' event to all other connected clients, informing them that a new user has joined the chat and passing the name of the new user as a parameter.
    });

    // if someone sends a message, broadcast it to other people
    socket.on('send', message => { // listens for the 'send' event
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    //  broadcasts a 'receive' event to all other connected clients, passing the message and the name of the sender
    });

    // if someone leaves the chat, let other know
    socket.on('disconnect', message => { // listens for the 'disconnect' event,
        socket.broadcast.emit('left', users[socket.id]); //  emits a 'left' event to all other connected clients, informing them that a user has left the chat and passing the name of the user who left
        delete users[socket.id]; // removes the user's name from the users object, since they have left the chat.
    });
})

    