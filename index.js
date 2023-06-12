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
    socket.on('set nickname', (nickname) => {
        users[socket.id] = nickname;

        // Broadcast a message when someone connects
        socket.broadcast.emit('chat message', {
            nickname: 'System',
            message: `${nickname} has joined the chat`
        });
    });

    socket.on('chat message', (data) => {
        const { nickname, message } = data;
        io.emit('chat message', { nickname, message });
    });

    socket.on('disconnect', () => {
        const nickname = users[socket.id];
        delete users[socket.id];

        // Broadcast a message when someone disconnects
        socket.broadcast.emit('chat message', {
            nickname: 'System',
            message: `${nickname} has left the chat`
        });
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});