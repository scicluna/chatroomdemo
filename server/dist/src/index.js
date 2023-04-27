import express from "express";
import session from "express-session";
import cors from "cors";
import WebSocket, { WebSocketServer } from "ws";
//Passport imports
import passport from "passport";
import "./passport-setup.js";
//Dirname/Path Hack
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
//Declare port
const port = process.env.PORT || 3000;
//Import prisma client and initialize it
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
//boilerplate middlewares
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../../../client/dist')));
app.use(cors({
    origin: ['http://localhost:5173', 'https://voidchat.herokuapp.com', 'http://voidchat.herokuapp.com', 'voidchat.herokuapp.com'],
    credentials: true,
    allowedHeaders: ['Content-Type']
}));
app.use(session({
    secret: 'asdasdasdasdsad',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true,
        httpOnly: true,
        domain: 'voidchat.herokuapp.com',
        sameSite: 'none',
        maxAge: 86400000 // Cookie expiration in milliseconds ~4 hours
    }
}));
//declare passports as middleware
app.use(passport.initialize());
app.use(passport.session());
// Google Auth Routes
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
app.get("/auth/google/callback", passport.authenticate("google"), (_req, res) => {
    res.redirect("/");
});
// Gihub Auth Routes
app.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));
app.get("/auth/github/callback", passport.authenticate("github"), (_req, res) => {
    res.redirect('/');
});
// Root Route
app.get("/", (_req, res) => {
    res.sendFile(path.join(__dirname, '../../../client/dist/index.html'));
});
// Fetch current user
app.get("/api/user", (req, res) => {
    console.log('fetch user data');
    if (req.user) {
        res.send(req.user);
    }
    else {
        res.status(401).send({ error: "Not authenticated" });
    }
});
// Post New User(Testing Only)
app.post("/api/user", async (req, res) => {
    try {
        const newUser = await prisma.user.create({
            data: {
                username: req.body.username,
                email: req.body.email
            },
        });
        res.send(newUser);
        console.log('Created new user with a chat:', newUser);
    }
    catch (err) {
        console.error(err);
    }
});
//destroys the current session on logout and redirects to the homepage
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log('Error destroying session:', err);
            return res.status(500).send('Error logging out');
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});
//finds the most recent 100 chats
app.get("/api/chat", async (_req, res) => {
    try {
        const chats = await prisma.chat.findMany({
            include: {
                author: true,
            },
            take: 100,
            orderBy: {
                createdAt: 'asc'
            }
        });
        res.send(chats);
    }
    catch (err) {
        console.log(err);
    }
});
// Post new chat
app.post("/api/chat", async (req, res) => {
    try {
        //build a new chat with prisma including the author
        const newChat = await prisma.chat.create({
            data: {
                authorId: req.body.authorId,
                body: req.body.body
            },
            include: {
                author: true
            }
        });
        res.send(newChat);
        //broadcast an object to all websockets called "NEW_CHAT" with the created prisma object as data.
        broadcast({ type: "NEW_CHAT", data: newChat });
    }
    catch (err) {
        console.log(err);
    }
});
//Establish web socket server (no server allows it to run on the same port as our express server)
const wss = new WebSocketServer({ noServer: true });
// Broadcast function to send data to all connected clients
function broadcast(data) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}
// Set up the WebSocket server connection handling
// Adds a connection listener to our web socket server
wss.on("connection", (ws) => {
    ws.on("message", (message) => {
        console.log("Received: %s", message);
    });
    ws.on("close", () => {
        console.log("Client disconnected");
    });
});
// Start express server
const server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
server.on("upgrade", (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request); //when upgrade is successful, emits a connection event (like from wss.on("connection"...))
    });
});
//# sourceMappingURL=index.js.map