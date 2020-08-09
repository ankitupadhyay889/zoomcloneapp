const express = require('express');

const app = express();

const server = require('http').Server(app);

const io = require('socket.io')(server);

const { v4: uuidV4 } = require('uuid');
// uuid jo hai wo room id crearte krta jisse log juddjaye.....

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`);
})

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
      socket.join(roomId)
      socket.to(roomId).broadcast.emit('user-connected', userId)
  
      socket.on('disconnect', () => {
        socket.to(roomId).broadcast.emit('user-disconnected', userId)
      })
    })
})

server.listen(5000 , () => {
    console.log("Server is started at 5000");
});