import express from "express";
import session from "express-session";
import cors from "cors";
import passport from "passport";
import "./passport-setup.js";

import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = process.env.PORT || 3000;

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, '../../../client/dist')));

// Add routes for Google and GitHub authentication
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/auth/google/callback", passport.authenticate("google"), (_req, res) => {
    // Redirect to your desired route after successful authentication
    res.redirect("/");
});

app.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));

app.get("/auth/github/callback", passport.authenticate("github"), (_req, res) => {
    // Redirect to your desired route after successful authentication
    res.redirect('/');
});


app.get("/", (_req, res) => {
    res.sendFile(path.join(__dirname, '../../../client/dist/index.html'));
});

app.get("/api/user", (req, res) => {
    console.log('fetch user data')
    if (req.user) {
        res.send(req.user);
    } else {
        res.status(401).send({ error: "Not authenticated" });
    }
});

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

app.post("/api/chat", async (req, res) => {
    try {
        const newChat = await prisma.chat.create({
            data: {
                authorId: req.body.authorId,
                body: req.body.body
            }
        })
        res.send(newChat)
        console.log(newChat)
    } catch (err) {
        console.log(err)
    }
})


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});