import express from "express";
import session from "express-session";
import passport from "passport";
import "./passport-setup";

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;

app.use(session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
}))

app.use(passport.initialize());
app.use(passport.session());

// Add routes for Google and GitHub authentication
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/auth/google/callback", passport.authenticate("google"), (_req, res) => {
    // Redirect to your desired route after successful authentication
    res.redirect("/");
});

app.get("/auth/github", passport.authenticate("github", { scope: ["profile", "email"] }));

app.get("/auth/github/callback", passport.authenticate("github"), (_req, res) => {
    // Redirect to your desired route after successful authentication
    res.redirect("/");
});


app.get("/", (_req, res) => {
    res.send("Hello, World!");
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