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

/*app.get('/', (req,res) => {
    res.redirect(`/${uuidv4()}`);
}) */

const visited =[]

app.get('/', (req, res) => {
    res.render('index');
  });

app.get("/:room", function(req, res){
    res.render("room", {roomId: req.params.room, visited:visited})
});

app.post("/room", function(req, res){
    var name = req.body.Name;
    var newPark = {name: name};
    visited.push(newPark);
    res.redirect(`/${uuidv4()}`);
 });



/*app.get('/:room', (req,res, next) =>{
    res.render('room', {roomId: req.params.room})
})*/

const users = {}

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
        socket.broadcast.emit('user-connected', name)
      })
      socket.on('send-chat-message', message => {
        socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
      })

})

server.listen(process.env.PORT||3030);