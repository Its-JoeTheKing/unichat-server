const e = require("cors");
const http = require("http");

const server = http.createServer().listen(3000);

const io = require("socket.io")(server,
    {
        cors: {
            origin: "*"
        }
    }
);

var users = [];
io.on('connection', (socket) => {
    io.emit('user-list', users);
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('new-user', (user) => {
            users.push(user);
            io.emit('user-list', users);
            console.log('new user ' + user.user + ' connected');
        }
    );
    socket.on('priv-message', (message,id,room,user) => {
        console.log(user);
        io.to(room).emit('receive-message', message,id,user);
        console.log('private message sent');
    })
    
    socket.on('join-room', (room) => {
        socket.join(room);
    });
});