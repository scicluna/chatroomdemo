import http from 'http'
import { Server } from 'socket.io'

const server = http.createServer();
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Replace with your client URL
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');

    // Listen for new chat events
    socket.on('newChat', (chat) => {
        console.log('newChat:', chat);

        // Broadcast the new chat to all connected clients
        io.emit('updateChats', chat);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(3001, () => {
    console.log('Socket server listening on *:3001');
});
