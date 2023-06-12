const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Store nickname-user mapping
const users = {};

io.on('connection', (socket) => {
    socket.on('chat message', (data) => {
        const { nickname, message } = data;
        io.emit('chat message', { nickname, message });
    });

    socket.on('set nickname', (nickname) => {
        users[socket.id] = nickname;
    });

    socket.on('disconnect', () => {
        delete users[socket.id];
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});