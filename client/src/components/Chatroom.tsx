import MessageBar from "./MessageBar";
import { useEffect, useState, useMemo } from "react";

export default function Chatroom() {
    const [chats, setChats] = useState<Chat[]>([])

    const socket = useMemo(() => {
        return new WebSocket("wss://voidchat.herokuapp.com/ws");
    }, []);

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
            const chat = await getChats();
            if (!chat) return;
            setChats(chat);
        }
        loadChats();

        let socket: WebSocket;

        const setupWebSocket = () => {
            // Create a new WebSocket instance
            socket = new WebSocket("your-websocket-url");

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

            // Handle WebSocket disconnection
            socket.addEventListener("close", (event) => {
                console.log("WebSocket connection closed:", event);

                // Remove the message event listener
                socket.removeEventListener("message", handleMessage);

                // Attempt to reconnect after a delay
                setTimeout(() => {
                    setupWebSocket();
                }, 5000); // 5 seconds
            });
        };

        setupWebSocket();

        // Clean up the WebSocket connection and listeners when the component is unmounted
        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, []);



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
            <MessageBar socket={socket} />
        </>
    )
}