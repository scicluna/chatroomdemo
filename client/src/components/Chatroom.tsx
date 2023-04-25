import MessageBar from "./MessageBar";
import { useEffect, useState } from "react";
import socket from '../socket';

export default function Chatroom() {
    const [chats, setChats] = useState<Chat[]>([])

    async function getChats() {
        const response = await fetch("https://voidchat.herokuapp.com/api/chat");
        if (response.status === 200) {
            const chat = await response.json();
            return chat;
        } else {
            return null;
        }
    }

    useEffect(() => {
        async function loadChats() {
            const chat = await getChats()
            if (!chat) return
            setChats(chat)
        }
        loadChats();

        // Listen for the 'updateChats' event and update the state
        socket.on('updateChats', (newChat) => {
            setChats((prevChats) => [...prevChats, newChat]);
        });

        // Clean up the listener when the component is unmounted
        return () => {
            socket.off('updateChats');
        };
    }, [])

    console.log(chats)

    return (
        <>
            <main className="h-screen w-screen p-5 bg-zinc-800 text-lime-500 overflow-y-scroll">
                {chats.map((chat, i) => {
                    return (
                        <div key={i} className="flex gap-5">
                            <p>{chat.author?.username || 'Unknown'}:</p>
                            <p>{chat.body}</p>
                        </div>

                    )
                })}
            </main>
            <MessageBar />
        </>
    )
}