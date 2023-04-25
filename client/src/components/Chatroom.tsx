import MessageBar from "./MessageBar";
import { useEffect, useState } from "react";
// import socket from '../socket';

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

        // Set up WebSocket connection
        const socket = new WebSocket("wss://voidchat.herokuapp.com");

        // Connection opened
        socket.addEventListener("open", (event) => {
            console.log("WebSocket connection opened:", event);
        });

        // Handle incoming messages
        const handleMessage = (event: any) => {
            console.log("WebSocket message received:", event);
            const message = JSON.parse(event.data);

            if (message.type === "NEW_CHAT") {
                // Update the chats state with the new chat
                setChats((prevChats) => [...prevChats, message.data]);
            }
        };

        // Listen for messages
        socket.addEventListener("message", handleMessage);

        // Clean up the WebSocket connection and listeners when the component is unmounted
        return () => {
            socket.removeEventListener("message", handleMessage);
            socket.close();
        };

        // Listen for the 'updateChats' event and update the state
        // socket.on('updateChats', (newChat) => {
        //     console.log(socket)
        //     setChats((prevChats) => [...prevChats, newChat]);
        // });

        // Clean up the listener when the component is unmounted
        // return () => {
        //     socket.off('updateChats');
        // };
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