const express = require('express');
const app=express();
const server=require('http').Server(app);
const {v4: uuidv4} = require('uuid');
const io=require('socket.io')(server)
const {ExpressPeerServer} = require('peer');
const bodyParser = require("body-parser");
const peerServer =ExpressPeerServer(server, {
    debug:true
});

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/peerjs', peerServer);

const visited =[]

//To render login page
app.get('/', (req, res) => {
    res.render('index');
  });

app.get("/:room", function(req, res){
    res.render("room", {roomId: req.params.room, visited:visited})
});

//To redirect from index page to video call room
app.post("/room", function(req, res){
    var name = req.body.Name;
    var newPark = {name: name};
    visited.push(newPark);
    res.redirect(`/${uuidv4()}`);
 });


const users = {} //Maintains the list of currently present users in video call

io.on('connection', socket =>{
    socket.on('join-room', (roomId, userId) =>{
        socket.join(roomId);
        //Broadcasting that a User has joined
        socket.broadcast.to(roomId).emit('user-connected', userId);
        socket.on('disconnect', () =>{
            socket.broadcast.to(roomId).emit('user-disconnected', userId, users[socket.id])
            delete users[socket.id]
        })
    })

    socket.on('new-user', name => {
        users[socket.id] = name
        socket.broadcast.emit('user-chatconnected', name)
    })
    socket.on('send-chat-message', message => {
        socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
    })

    socket.on('raise-hand', () => {
        io.to(roomId).emit('raiseHand', userName)
    }); 

})

server.listen(process.env.PORT||3030);