import express from "express";
import session from "express-session";
import cors from "cors";
import WebSocket from "ws"

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
    origin: 'http://localhost:5173',
    credentials: true,
    allowedHeaders: ['Content-Type']
}))
app.use(session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
}))
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

// API User Routes -- Migrate to another folder later
// Fetch current user
app.get("/api/user", (req, res) => {
    console.log('fetch user data')
    if (req.user) {
        res.send(req.user);
    } else {
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
        res.send(newUser)
        console.log('Created new user with a chat:', newUser);
    } catch (err) {
        console.error(err);
    }
})

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

app.get("/api/chat", async (_req, res) => {
    try {
        const chats = await prisma.chat.findMany({
            include: {
                author: true,
            }
        })
        res.send(chats)
    } catch (err) {
        console.log(err)
    }
})

// Post new chat -- Migrate later to a new folder
app.post("/api/chat", async (req, res) => {
    try {
        const newChat = await prisma.chat.create({
            data: {
                authorId: req.body.authorId,
                body: req.body.body
            },
            include: {
                author: true
            }
        })
        res.send(newChat)
        console.log(newChat)
        broadcast({ type: "NEW_CHAT", data: newChat });
    } catch (err) {
        console.log(err)
    }
})

const wss = new WebSocket.Server({ noServer: true })

// Broadcast function to send data to all connected clients
function broadcast(data: any) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

// Set up the WebSocket server connection handling
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
        wss.emit("connection", ws, request);
    });
});