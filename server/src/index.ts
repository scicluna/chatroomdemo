import express from "express";

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;

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