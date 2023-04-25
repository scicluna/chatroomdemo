import http from 'http';
import { Server } from 'socket.io';
const server = http.createServer();
const isProduction = process.env.NODE_ENV === "production";
const clientURL = isProduction ? "https://voidchat.herokuapp.com/" : "http://localhost:3000";
const io = new Server(server, {
    cors: {
        origin: clientURL,
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
const port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log(`Socket server listening on *:${port}`);
});
//# sourceMappingURL=socket.js.map